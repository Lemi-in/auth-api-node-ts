import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },  // Fixed typo
    email: { type: String, required: true },  // Added email field for validation
    authentication: {
        password: { type: String, required: true, select: false }, // Password inside authentication
        salt: { type: String, select: false },  // Salt for hashing password
        sessionToken: { type: String, select: false }  // For session management
    }
});


export const UserModel = mongoose.model("User", UserSchema)

export const getUsers = async () => {
    return UserModel.find().exec();
}

export const getUser = async (username: string) => {
    return UserModel.findOne({ username }); 
}
export const getUserByEmail = async (email: string) => {
    return UserModel.findOne({ email });  
}
export const getUserBySessionToken = async (sessionToken: string) => {
    return UserModel.findOne({ "authentication.sessionToken": sessionToken });
}
export const getUserById = async (id: string) => {
    return UserModel.findById(id);
}
export const createUser = async (values: Record<string, any>) => {
    return new UserModel(values).save().then((user) => user.toObject());
};


export const deleteUserById = async (id: string) => {
    return UserModel.findOneAndDelete({ _id: id });
}
export const updateUserById = async (id: string, values: Record<string, any>) => {
    return UserModel.findOneAndUpdate({ _id: id }, values, { new: true }).exec();
}