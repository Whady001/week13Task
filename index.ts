
import bodyParser from 'body-parser';
import cors from 'cors';
import router from './src/routes/noteRoutes';
import bcrypt from 'bcrypt';
import { authenticateUser } from './src/middlewares/authUser.middleware';
import dotenv from 'dotenv';
import { User } from './src/models/user-auth.model';
import { Request, Response, NextFunction } from 'express';


const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET;
const express = require('express');
const mongoose = require('mongoose')


dotenv.config();
const app = express();
const PORT = process.env.PORT || 3030;

// MongoDB connection
const mongoURI = process.env.MONGODB_URI; 
mongoose.connect(mongoURI)
    .then(() => console.log('MongoDB connected'))
    .catch((error:any)=> {console.error(`MongoDB connection error: ${error.message}`)});

app.use(cors());
app.use(bodyParser.json());
app.use('/api/notes', router);
app.use(express.json());
app.post('/login', authenticateUser, async(req: Request, res: Response)=>{
    try {
        const  {email, password} = req.body;
        //check if user exists in db
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({message: 'Invalid credentials'});
        }
        //compare provided password with previously stored password
        const isMatch = await bcrypt.compare(password, user.passwordHash)
        if (!isMatch) {
            return res.status(402).json({message: 'Invalid credentials'})
        }
        // Generate a JWT token
        const token : unknown = jwt.sign({username: user.username, email: user.email}, secretKey, { expiresIn: '1h' });

        // Send the token back to the client
        return res.status(200).json({ token });
    } catch (error) {
        console.error(error);
        return res.status(500).json({message: 'Server error' });
    }
    }
)
app.get('/protected', authenticateUser, (req: Request, res: Response) => {
    return res.status(200).json({message: 'You have access to this protected route'})
})

//for jwt validation
const validateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1]; //Bearer <token>

        jwt.verify(token, secretKey, (err, payload) => {
            if (err) {
                return res.status(403).json({success: false, message: 'invalid token'})
            
            }
            else {
                req.user = payload;
                next();
            }
        });    
    } else {
        res.status(401).json({success: false, message: 'invalid username or password'})
    };
}

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

