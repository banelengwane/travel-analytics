import { Schema, model } from 'mongoose'
import bycrypt from 'bcryptjs';

const UserSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true }
});

// hash the passwords before saving
UserSchema.pre('save', async function (next)) {
    if(!this.isModified('password')) return next();
    this.password = await bycrypt.hash(this.password, 12);
    next();
});

export const User = model('User', UserSchema);