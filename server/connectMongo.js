import mongoose from "mongoose";

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI + process.env.DB_NAME);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.log('Unable to connect Mongo!');
    }
}

connectDB();