import { Request, Response, NextFunction } from "express";

const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET as string;

// Extend the Request interface to include userId and email
declare global {
    namespace Express {
        interface Request {
            userId?: string;
            email?: string; 
        }
    }
}


//middleware to authenticate and authorize requests
export const authenticateUser = (req: Request, res: Response, next: NextFunction) => {
    try {
        //Extract token from authorization header
        const authHeader = req.header('Authorization')
        if (!authHeader) {
            return res.status(401).json({ error: "Authorization header missing" });
        }
        const token = authHeader.replace('Bearer ', '').trim();
        //verify token using the secret key
        const decoded = jwt.verify(token, secretKey) as { userId: string; email: string };
        //attach user id and email to the request object for further processing
        req.userId = decoded.userId;
        req.email = decoded.email;
        next();        
    } catch (error) {
        return res.status(401).json({error: "Invalid or expired token"});
    }
}
 

