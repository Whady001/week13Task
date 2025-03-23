import  {User, IUser} from '../models/user-auth.model';
import {UserService} from '../services/user-auth.service';
import {Request, Response} from 'express';

const bcrypt = require('bcrypt');


export class UserController {
    private userService: UserService;

    constructor() {
        this.userService = new UserService();
    }
    //create a user
    async createUser (req: Request, res: Response) {
        try {
            //validate input
            const {username, email, password} = req.body;
            if (!username || !email || !password) {
                return res.status(400).json({message: 'All username, email and password fields must be filled'})
            }
            //check if the user already exists
            const existingUser = await this.userService.getUserInfo(email)
            if (existingUser) {
                return res.status(401).json({message: `Username or email already exists`})
            }

            //hash password
            const saltRounds = 10;
            const passwordHash = await bcrypt.hash(password, saltRounds);

            //create user record
            const userId = User._id
            const newUser : IUser  = { _id, username, email, passwordHash};
            
            const createdUser : IUser = await this.userService.createUser(newUser);
            
            return res.status(200).json({message: `User was successfully created`, user: createdUser});
        }
        catch (error) {
            console.error("Error creating user:", error);
            return res.status(500).json({ message: "Internal server error." });     
        }
    }
    //Update e.g change username or password
    async updateUserDetails (req: Request, res: Response) {
        try {
            const userId = req.params._id
            const { username, email,  password } = req.body;
            //fetch user from database
            const updateData : Partial<IUser> = {}
            if (username) {
                return updateData.username = username;
            }
            if (email) {
                return updateData.email = email;
            }
            if (password) {
                const saltRounds = 10;
                return updateData.passwordHash = await bcrypt.hash(password, saltRounds)
            }
            const updatedUser = await this.userService.getUserInfo(userId);
            if (!updatedUser) {
                return res.status(403).json({message: `User details could not be updated`});
            }
            return res.status(200).json({message: `User details has been updated`})
        }
        catch(error) {
            console.error(`Error updating user info: `, error)
            return res.status(500).json({message: `Internal Server error`})
        }     
    }
    //get user info
    async getUserInfo (req: Request, res: Response) {
        try {
            const userId = req.params._id
            const userInfo : IUser | null = await this.userService.getUserInfo(userId);
        
            if (!userInfo) {
                return res.status(404).json({message: `User does not exist`})
            } else {
                return res.status(200).json({message: `User exists`, userInfo})
            }

        } catch (error: any) {
            console.error(`Error fetching user information, ${error.message}`)
            return res.status(500).json({message: `Internal server error`});
        }
    }  
    //delete user
    async deleteUser (req: Request, res: Response) {
        try {
            const userId = req.params._id
            const userInfo : IUser | null = await this.userService.getUserInfo(userId);
            if (!userInfo) {
                return res.status(404).json({message: `User not found`})
            } else {
                const deleteUserInfo : IUser | null = await this.userService.deleteUser(userId);
                return res.status(200).json({message: `Deletion successful`});
            }
        } catch (error) {
            console.error(`Error processing deletion`)
            return res.status(500).json({message: `Internal server error`});
        }
    }

}
export default UserController;