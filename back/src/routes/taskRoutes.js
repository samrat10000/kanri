import express from 'express';
import {
    createTask,
    getTasks,
    updateTask,
    deleteTask
} from '../controllers/taskController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Apply protection to all routes below data
router.use(protect);

// Clean URL Structure
router.route('/')
    .get(getTasks)
    .post(createTask);

router.route('/:id')
    .put(updateTask)
    .delete(deleteTask);

export default router;
