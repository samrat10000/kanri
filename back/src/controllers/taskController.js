import Task from '../models/Task.js';
import User from '../models/User.js'; // We need this to ensure user exists

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Public (for now)
export const createTask = async (req, res) => {
    try {
        // Add user to body
        req.body.user = req.user.id; // From the token!

        // We expect the user ID to be passed in the body for this simpler version
        // In a real app, it would come from req.user set by authentication
        const newTask = await Task.create(req.body);

        res.status(201).json({
            success: true,
            data: newTask
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Get all tasks with filtering
// @route   GET /api/tasks
// @desc    LESSON: Advanced Querying & Pagination
export const getTasks = async (req, res) => {
    try {
        // 1. Build Query
        const queryObj = { ...req.query };
        const excludedFields = ['page', 'sort', 'limit', 'fields', 'search'];
        excludedFields.forEach(el => delete queryObj[el]);

        // 2. Build Filter Object (Starting with user filter)
        const filterObj = { ...queryObj, user: req.user.id };

        // 3. NEW: Search functionality (Regex for partial matching)
        if (req.query.search) {
            // MongoDB $regex allows partial, case-insensitive search
            filterObj.title = { $regex: req.query.search, $options: 'i' };
        }

        // 4. Apply filters
        let query = Task.find(filterObj);

        // 5. Sorting
        if (req.query.sort) {
            query = query.sort(req.query.sort);
        } else {
            query = query.sort('-createdAt'); // Default: newest first
        }

        // 6. Pagination
        // page=1&limit=10 means: skip 0, take 10
        // page=2&limit=10 means: skip 10, take 10
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const skip = (page - 1) * limit;

        query = query.skip(skip).limit(limit);

        // 7. Execute
        // .populate('user') works like a SQL JOIN to get user details
        const tasks = await query.populate('user', 'name email'); 

        res.status(200).json({
            success: true,
            count: tasks.length,
            data: tasks
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Update a task
// @route   PUT /api/tasks/:id
export const updateTask = async (req, res) => {
    try {
        let task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ success: false, error: 'Task not found' });
        }

        // Make sure user is task owner
        if (task.user.toString() !== req.user.id) {
            return res.status(401).json({ success: false, error: 'Not authorized to update this task' });
        }

        task = await Task.findByIdAndUpdate(req.params.id, req.body, {
            new: true, // Return the updated object, not the old one
            runValidators: true // Enforce Schema validation on update
        });

        res.status(200).json({ success: true, data: task });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
export const deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ success: false, error: 'Task not found' });
        }

        // Make sure user is task owner
        if (task.user.toString() !== req.user.id) {
            return res.status(401).json({ success: false, error: 'Not authorized to delete this task' });
        }

        await task.deleteOne(); // Use deleteOne() to trigger middleware if present

        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};
