import Task from '../models/Task.js';

// @desc    Get Task Statistics
// @route   GET /api/stats
// @desc    LESSON: Aggregation Pipeline
//          Aggregation is a list of "stages". Data flows through them like a factory line.
export const getTaskStats = async (req, res) => {
    try {
        const stats = await Task.aggregate([
            // STAGE 1: Match (Filter by Current User)
            { 
                $match: { user: req.user._id } 
            },

            // STAGE 2: Group

            // STAGE 2: Group
            // We group by '$status'. The _id field becomes the distinct statuses.
            // $sum: 1 counts the documents in that group.
            {
                $group: {
                    _id: '$status', // Group by unique status
                    numTasks: { $sum: 1 }, // Count them
                    minDate: { $min: '$createdAt' }, // Oldest task
                    maxDate: { $max: '$createdAt' }  // Newest task
                }
            },

            // STAGE 3: Sort
            // Sort by number of tasks (Descending)
            {
                $sort: { numTasks: -1 }
            }
        ]);

        res.status(200).json({
            success: true,
            data: stats
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};
