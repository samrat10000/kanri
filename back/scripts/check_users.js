import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import User from '../src/models/User.js';

// Load env vars
// Adjusted path to point to back/.env assuming we run from back/scripts or back/
// If run from back/, it's .env
// If run from back/scripts/, it's ../.env
// Let's assume we run from back/
dotenv.config(); 

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

const checkUsers = async () => {
    await connectDB();

    const users = await User.find({});
    console.log('--- USERS ---');
    users.forEach(user => {
        console.log(`ID: ${user._id}, Name: ${user.name}, Email: ${user.email}, Role: ${user.role}`);
    });
    console.log('-------------');

    // Check for "killit" specifically
    const killit = users.find(u => u.name.toLowerCase() === 'killit' || u.email.toLowerCase().includes('killit'));
    if (killit) {
        console.log(`FOUND 'killit' user: ${killit.name} (${killit.email})`);
    } else {
        console.log("User 'killit' NOT FOUND.");
    }

    process.exit();
};

checkUsers();
