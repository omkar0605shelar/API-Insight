import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
export const initDb = async () => {
    try {
        const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/api_insight';
        await mongoose.connect(mongoUri);
        console.log('Connected to MongoDB');
    }
    catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }
};
