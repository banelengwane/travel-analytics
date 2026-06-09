import { model, Schema } from "mongoose";

export interface ITrip extends Document {
    user: Schema.Types.ObjectId;
    destination: string;
    coordinates: {
        type: string;
        coordinates: [number, number]; //[Longitude, latitude]
    };
    startDate: Date;
    endDate: Date;
    expenses: { category: string; amount: number; currency: string}[];
}

const TripSchema = new Schema<ITrip>({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true},
    destination: { type: String, required: true},
    coordinates: {
        type: { type: String, enum: ['Point'], default: 'Point'},
        coordinates: { type: [Number], required: true }
    },
    startDate: { type: Date, required: true },
    endDate: {type: Date, required: true},
    expenses: [{
        category: { type: String, required: true },
        amount: { type: Number, required: true },
        currency: { type: String, default: 'USD'}
    }]
});

// indexing for high-performance spatial queries
TripSchema.index({ coordinate: '2dsphere'});

export const Trip = model<ITrip>('Trip', TripSchema);