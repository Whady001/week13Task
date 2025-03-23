import { IUser, IAuthCredentials, IAuthResponse} from "../models/user-auth.model";
import {User} from "../models/user-auth.model";

export class UserService {
    //create a user
    async createUser (newUser : IUser): Promise<IUser > {
        try {
            return await User.create(newUser);
        } catch (error : unknown) {
            throw new Error(`Error creating user: ${error}`);
        }
    }
    //read a user i.e find user by id and return username and email
    async getUserInfo (userId: string): Promise<IUser  | null> {
        try {
            return await User.findById(userId).select('username email'); // Select only username and email
        } catch (error : unknown) {
            throw new Error(`Error fetching user info: ${error}`);
        }
    }
    //update: change email, change password
    async updateUserInfo (userId : string, updateData: Partial<IUser >): Promise<IUser  | null> {
        try {
        return await User.findByIdAndUpdate(userId, updateData, {new: true});
        } catch  (error : unknown) {
            throw new Error(`Error updating user information: ${error}`);
        }
    }
    //delete: delete a user account
    async deleteUser (userId: string): Promise<IUser  | null> {
        try {
            return await User.findByIdAndDelete(userId);
        } catch (error: unknown) {
            throw new Error(`Error deleting user: ${error}`);
        }
    }
    
};

module.exports = new UserService;
