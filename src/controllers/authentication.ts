import express from 'express';
import { getUserByEmail, createUser } from '../db/users';
import { generateRandomString, authentication } from '../helpers';
import { UserModel } from '../db/users';


export const login = async (req: express.Request, res: express.Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const user = await UserModel.findOne({ email })
            .select('+authentication.salt +authentication.password')
            .exec();

        if (!user) {
            return res.status(400).json({ message: 'User does not exist' });
        }
        user.authentication.sessionToken = generateRandomString(16); // Or however you generate it
        await user.save();

        // Hash the password with the stored salt
        const expectedPassword = authentication(user.authentication.salt, password);
        if (expectedPassword !== user.authentication.password) {
            return res.status(403).json({ message: 'Invalid password' });
        }

        // Do not change the salt here
        // Just set the session token or any other response actions
        res.cookie('ANTONIO-AUTH', user.authentication.sessionToken || user.authentication.salt, {
            httpOnly: true, // Helps prevent XSS attacks
            path: '/',
        });

        return res.status(200).json(user);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400); // Return a 400 status on error
    }
};



export const register = async (req: express.Request, res: express.Response) => {
    try {
        const { email, password, username } = req.body; // Extract email, password, and username

        // Check if all fields are present
        if (!email || !password || !username) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Check if the user already exists
        const existingUser = await getUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Generate a random salt
        const salt = generateRandomString(16);

        // Hash the password using the salt
        const hashedPassword = authentication(salt, password);

        // Create the user
        const user = await createUser({
            email,
            username, // Ensure this matches the schema
            authentication: {
                password: hashedPassword, // Store hashed password
                salt,  // Store salt
            },
        });

        // Return the created user
        return res.status(200).json(user);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400); // Return a 400 status on error
    }
};
