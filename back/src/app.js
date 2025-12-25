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
// This allows the Frontend to talk to Backend
// credentials: true IS REQUIRED for cookies to work!
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    'https://kanri.onrender.com',
    'https://kanri-frontend.onrender.com',
    'https://kanri-1s2f.onrender.com'  // Actual deployed URL
];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or Postman)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1 || origin.endsWith('.onrender.com')) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
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
