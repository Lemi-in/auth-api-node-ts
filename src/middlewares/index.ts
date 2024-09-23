import express from "express";
import {get , merge} from 'lodash';
import {getUserBySessionToken} from '../db/users';


export const isAuthenticated = async (req: express.Request, res: express.Response, next: express.NextFunction) => {

try {
    const sessionToken = req.cookies['ANTONIO-AUTH'];

    if (!sessionToken) {
        return res.status(403).json({ message: 'Unauthorized' });

    }
    const existingUser = await getUserBySessionToken(sessionToken);
    console.log('Existing User:', existingUser);
    
    if (!existingUser) {
        return res.status(401).json({ message: 'Unauthorized' });
    }


    merge(req, {identity: existingUser});
    return next()
} catch (error) {
    
}
}

export const isOwner = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const {id} = req.params;
        const currentUserId = get(req, 'identity._id') as string;
        if (!currentUserId) {
            return res.sendStatus(403);
        }
        if (currentUserId.toString() !== id) {
            return res.sendStatus(403);
        }
        return next();
    } catch (error) {
        console.log(error);
        return res.sendStatus(403);
    }
}
