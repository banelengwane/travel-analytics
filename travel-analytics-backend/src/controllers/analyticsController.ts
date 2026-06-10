import { Request, Response } from "express";
import { Trip } from "../models/Trip";
import { Types } from "mongoose";

export const getTravelStats = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user.id; //this will be coming from JWT auth middleware

        const stats = await Trip.aggregate([
            { $match: {user: new Types.ObjectId(userId) } },
            { $unwind: '$expenses' },
            {
                $group: {
                    _id: '$expenses.category',
                    totalSpent: { $sum: '$expenses.amount' },
                    tripCount: { $addToSet: '$_id' }
                }
            },
            {
                $project: {
                    category: '$_id',
                    totalSpent: 1,
                    uniqueTrips: { $size: '$tripCount'},
                    _id: 0
                }
            }
        ]);

        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: 'Error computing backend analytics pipelines', error})
    }
};

export const getMonthlyExpenses = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user.id;

        const monthlyData = await Trip.aggregate([
            { $match: { user: new Types.ObjectId(userId) } },
            { $unwind: '$expenses' },
            {
                $group: {
                    _id: {
                        month: { $month: '$startDate' },
                        year: { $year: 'startDate'}
                    },
                    totalAmount: { $sum: '$expenses.amount' }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } },
            {
                $project: {
                    date: {
                        $concat: [
                            { $toString: '$_id.year' }, "-", { $toString: '$_id.month' }
                        ]
                    },
                    amount: '$totalAmount',
                    _id: 0
                }
            }
        ]);

        res.status(200).json(monthlyData);
    } catch (error) {
        res.status(500).json({ message: "Failed to generate monthly aggregation data pipeline", error});
    }
};