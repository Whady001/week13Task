import UserController from "../controllers/user-auth.controller";
import { Request, Response } from "express";
import  express from 'express'
import { IUser } from "../models/user-auth.model";
import { authenticateUser } from "../middlewares/authUser.middleware";
const userController = new UserController()
const router = express.Router()

router.get('/:_id', authenticateUser, async (req: Request, res: Response) => {
    try {
        const userId = req.params._id;
        const userInfo : IUser | null = await userController.getUserInfo(req, res, userId)
        if (!userInfo) {
            return res.status(404).json({message: 'User not found'})
        } return res.status(200).json({message: 'User exists', userInfo})
    } catch (error: any) {
        console.error(`Error fetching user information: ${error.message}`);
        return res.status(500).json({ message: 'Internal server error' });
    }
    }
);

export default router;