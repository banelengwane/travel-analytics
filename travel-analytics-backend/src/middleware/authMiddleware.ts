import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken';
//extending Express Request interface to recognize the user payload
declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}

export const protect = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        //read the token directly from the cookies parsed by cookie-parser middleware
        const token = req.cookies?.token;

        if(!token){
            res.status(401).json({ message: 'You are not logged in. Please log in to gain access.' });
            return;
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!);
        req.user = decoded; // this contains { id: "user_mongo_id"}

        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid or expired authentication token.' });
    }
};