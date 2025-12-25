import mongoose from 'mongoose';

/**
 * LESSON: Relationships in NoSQL
 * In SQL, you use JOINs. In Mongo/Mongoose, we often utilize "References".
 * keeping data separate but linked by IDs.
 */

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a task title'],
        trim: true
    },
    description: {
        type: String,
        maxlength: 500
    },
    status: {
        type: String,
        enum: ['pending', 'in-progress', 'completed'],
        default: 'pending'
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'low'
    },
    dueDate: {
        type: Date
    },
    // RELATIONSHIP: Linking a Task to a User
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User', // Must match the name in mongoose.model('User', ...)
        required: true
    },
    // NEW: Subtasks system
    subTasks: [
        {
            title: { type: String, required: true },
            completed: { type: Boolean, default: false }
        }
    ]
}, {
    timestamps: true
});

/**
 * LESSON: Query Performance
 * We will likely query tasks by User. e.g. "Get all tasks for User X".
 * To make this fast, we should Index the foreign key.
 */
taskSchema.index({ user: 1 }); // 1 for ascending order

export default mongoose.model('Task', taskSchema);
