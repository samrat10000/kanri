import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

/**
 * LESSON: Mongoose Schemas
 * MongoDB is "schema-less" (you can dump anything), but Mongoose enforces structure.
 * This is crucial for application integrity.
 */

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'], // Custom error message
        trim: true, // Auto-removes whitespace
        maxlength: [50, 'Name can not be more than 50 characters']
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true, // Creates a unique index - preventing duplicates
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    role: {
        type: String,
        enum: ['user', 'admin'], // ENUM: Restricts value to this list
        default: 'user'
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: 6,
        select: false // LESSON: Don't return password by default in queries
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    // OPTIONS
    timestamps: true, // Automatically manages createdAt and updatedAt
    toJSON: { virtuals: true }, // Add virtuals to JSON output
    toObject: { virtuals: true } // Add virtuals to Object output
});

/**
 * LESSON: Virtuals (Reverse Populate)
 * Instead of storing an array of Task IDs in the User (which gets huge),
 * we "virtually" look them up when needed.
 */
userSchema.virtual('tasks', {
    ref: 'Task', // The model to look up
    localField: '_id', // Find tasks where `localField`
    foreignField: 'user', // matches `foreignField`
    justOne: false // Return an array
});

/**
 * LESSON: Middleware (Hooks)
 * Encrypt password using bcrypt before saving
 */
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

/**
 * LESSON: Instance Methods
 * Add custom methods to our documents.
 */

// Sign JWT and return
userSchema.methods.getSignedJwtToken = function() {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
};

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

/**
 * LESSON: Indexing
 * `email: { unique: true }` creates a MongoDB Index. 
 * Indexes make search FAST but write SLOW (slightly). Use them for fields you search by often.
 */

export default mongoose.model('User', userSchema);
