import {Request, Response} from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import bcrypt from 'bcryptjs';

const signToken = (id: string) => {
    return jwt.sign({ id }, process.env.JWT_SECRET!, {
        expiresIn: process.env.JWT_EXPIRES_IN || '1d'
    });
};

export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email, password } = req.body;
        const newUser = await User.create({ name, email, password });

        const token = signToken(newUser._id.toString());

        //secure cookie config
        res.cookie('token', token, {
            httpOnly: true, //prevents XSS attacks
            secure: process.env.NODE_ENV === 'production', //only sends over https in prod
            sameSite: 'strict', // prevents csrf attacks
            maxAge: 24 * 60 * 60 * 1000 // expires in 1 day
        });

        res.status(201).json({
            status: 'success',
            user: { id: newUser._id, name: newUser.name, email: newUser.email }
        });
    } catch (error) {
        res.status(400).json({ message: 'Registration failed', error });
    }
}

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if(!user || !(await bcrypt.compare(password, user.password))) {
            res.status(401).json({ message: 'Incorrect email or password' });
            return;
        }

        const token = signToken(user._id.toString());

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000
        });

        res.status(200).json({
            status: 'success',
            user: { id: user._id, name: user.name, email: user.email};
        });
    } catch (error) {
        res.status(500).json({ message: 'Login error', error })
    }
};