import { Schema, model } from 'mongoose';

// Define the interface for URL document
export interface IUrl {
    _id?: string;
    longUrl: string;
    shortUrl: string;
    createdAt?: Date;
    updatedAt?: Date;
    expiresAt?: Date;
}

// Create the schema
export const urlSchema = new Schema<IUrl>({
    longUrl: {
        type: String,
        required: true,
    },
    shortUrl: {
        type: String,
        required: true,
        unique: true,
    },
    expiresAt: {
        type: Date,
        required: false,
    },
},
    {
        timestamps: true
    });
