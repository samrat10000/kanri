import express from 'express';

import mongoSanitize from 'express-mongo-sanitize';
import helmet from 'helmet';
import xss from 'xss-clean';
import cookieParser from 'cookie-parser';
import cors from 'cors'; // Import CORS
import taskRoutes from './routes/taskRoutes.js';
import statsRoutes from './routes/statsRoutes.js';
import authRoutes from './routes/authRoutes.js';

const app = express();

// Set security HTTP headers
app.use(helmet());

// Middleware
// This allows us to accept JSON data in the body of requests (req.body)
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// Enable CORS (Cross-Origin Resource Sharing)
// This allows the Frontend (port 5173) to talk to Backend (port 5000)
// credentials: true IS REQUIRED for cookies to work!
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    credentials: true
}));

// Data sanitization against NoSQL query injection
// Removes keys starting with $ or . from req.body, req.query, and req.params
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Basic Route to check if API is running
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Mount Routes
app.use('/api/tasks', taskRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/auth', authRoutes);

export default app;
