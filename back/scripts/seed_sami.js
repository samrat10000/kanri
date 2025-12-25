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

const seedSami = async () => {
    await connectDB();

    const userData = {
        name: 'SAMI',
        email: 'SAMI@gmail.com',
        password: '1234567',
        role: 'user'
    };

    // 1. Find or Create User
    let user = await User.findOne({ email: userData.email });

    if (user) {
        console.log('User SAMI exists. Updating credentials...');
        user.name = userData.name;
        user.password = userData.password; // Will be hashed by pre-save hook
        await user.save();
        
        // Clean up existing tasks to ensure clean state
        console.log('Removing old tasks for SAMI...');
        await Task.deleteMany({ user: user._id });
    } else {
        console.log('Creating new user SAMI...');
        user = await User.create(userData);
    }

    console.log(`User ID: ${user._id}`);

    // 2. Define Tasks
    const tasks = [
        // Pending
        {
            title: 'Emotional Check-In',
            priority: 'high',
            dueDate: new Date('2025-12-26'),
            status: 'pending',
            subTasks: [
                { title: "Ask How Shes's Feeling", completed: false },
                { title: 'Share personal Plans', completed: false }
            ]
        },
        {
            title: 'Polish Resume',
            priority: 'low',
            status: 'pending', // No due date mentioned
            subTasks: [
                { title: 'Project Description', completed: false },
                { title: 'Tech Stack Cleanup', completed: false },
                { title: 'Github Links', completed: false },
                { title: 'Final Export', completed: false }
            ]
        },
        {
            title: 'Daily Study Flow',
            priority: 'low',
            dueDate: new Date('2025-12-29'),
            status: 'pending',
            subTasks: [
                { title: 'Morning Revision', completed: false },
                { title: 'Lecture Notes', completed: false },
                { title: 'Practice Session', completed: false },
                { title: 'Night Review', completed: false }
            ]
        },
        {
            title: 'Wash Bike',
            priority: 'high',
            dueDate: new Date('2025-12-24'), // Overdue
            status: 'pending'
        },
        // In Progress
        {
            title: 'Weekend Date Plan',
            priority: 'high',
            dueDate: new Date('2026-01-01'),
            status: 'in-progress',
            subTasks: [
                { title: 'pick Place', completed: false },
                { title: 'Confirm Time', completed: false },
                { title: 'Outfit Check', completed: false },
                { title: 'Capture Moments', completed: false }
            ]
        },
        {
            title: 'Practice Dp',
            priority: 'medium',
            dueDate: new Date('2025-12-27'),
            status: 'in-progress'
        },
        {
            title: 'Create Pintrest Web',
            priority: 'high',
            dueDate: new Date('2025-12-31'),
            status: 'in-progress',
            subTasks: [
                { title: 'Backend', completed: false },
                { title: 'Design Selection', completed: false },
                { title: 'Frontend', completed: false },
                { title: 'Deploy', completed: false },
                { title: 'Test', completed: false }
            ]
        },
        // Completed
        {
            title: 'Buy Pecific-Rim Poster',
            priority: 'medium',
            dueDate: new Date('2025-12-23'),
            status: 'completed'
        }
    ];

    // 3. Create Tasks
    console.log(`Seeding ${tasks.length} tasks...`);
    
    for (const task of tasks) {
        await Task.create({
            ...task,
            user: user._id
        });
    }

    console.log('Seed completed successfully!');
    process.exit();
};

seedSami();
