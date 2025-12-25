import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../src/models/User.js';
import Task from '../src/models/Task.js';

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

const verifySami = async () => {
    await connectDB();

    const user = await User.findOne({ email: 'SAMI@gmail.com' });
    if (!user) {
        console.log('User SAMI not found!');
        process.exit(1);
    }
    console.log(`User Found: ${user.name} (${user.email})`);

    const tasks = await Task.find({ user: user._id });
    console.log(`Found ${tasks.length} tasks for SAMI:`);
    tasks.forEach(task => {
        console.log(`- [${task.status}] ${task.emoji || ''} ${task.title} (Due: ${task.dueDate ? task.dueDate.toISOString().split('T')[0] : 'None'})`);
    });

    process.exit();
};

verifySami();
