import express from 'express';
import { getTaskStats } from '../controllers/statsController.js';

import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, getTaskStats);

export default router;
