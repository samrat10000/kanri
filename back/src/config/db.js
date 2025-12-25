import mongoose from 'mongoose';

/**
 * Connects to the MongoDB Database.
 * Best Practice: Use a function to handle the connection logic asynchronously.
 * This pattern ensures your app fails fast if the DB is unreachable at startup.
 */
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);

        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        // Exit process with failure
        process.exit(1);
    }
};

export default connectDB;
