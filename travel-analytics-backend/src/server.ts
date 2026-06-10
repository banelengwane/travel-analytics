import express, { Application, Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

// load environment config variables
dotenv.config();

// controllers and middlewares
import { register, login } from './controllers/authController';
import { getTravelStats, getMonthlyExpenses } from './controllers/analyticsController';
import { protect } from './middleware/authMiddleware';

const app: Application = express();
const PORT = process.env.PORT || 5000;

// global middlwares & security policies

// CORS config to allow secure cookie transfer from react domain
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

//built-in body parser to read incoming JSON payloads 
app.use(express.json());

//cookie parser middleware to read tokens out of incoming headers
app.use(cookieParser());

// ROUTE DEFINITIONS

// public auth endpoints
app.post('/api/v1/auth/register', register);
app.post('/api/v1/auth/login', login);

// fallback "Me" verification handshake to check cookie validation on page refresh
app.get('/api/v1/auth/me', protect, (req: Request, res: Response) => {
    res.status(200).json({ status: 'success', user: req.user});
});

// protected analytics endpoints (guarded by our 'protect' middleware)
app.get('/api/v1/analytics/overview', protect, getTravelStats);
app.get('/api/v1/analytics/monthly', protect, getMonthlyExpenses);

//clear cookie endpoint for secure logout loops
app.post('/api/v1/auth/logout', (req: Request, res: Response) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
    });
    res.status(200).json({ status: 'success', message: 'Token cookie cleared successfully.'});
});

// DATABASE CONNECTION & SERVER BOOT
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/travel_portfolio';

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('Connected to MongoDB successfully.');
        
        app.listen(PORT, () => {
            console.log('Server executing seamlessly in ${process.env.NODE_ENV} mode');
        });
    })
    .catch((err) => {
        console.error('Database connection critical error ', err);
        process.exit(1);
    })