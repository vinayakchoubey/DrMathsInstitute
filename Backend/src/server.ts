import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';

dotenv.config();

// Log environment status for debugging (runs once at cold start)
console.log('[Server] Starting... Environment check:', {
    MONGO_URI_SET: !!process.env.MONGO_URI,
    VERCEL: process.env.VERCEL,
    NODE_ENV: process.env.NODE_ENV
});

const app: Application = express();
const PORT = process.env.PORT || 5000;

// Middleware - CORS configuration (MUST BE FIRST)
// Middleware - CORS configuration (MUST BE FIRST)
const allowedOrigins = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'https://drmaths-frontend.vercel.app',
    'https://dr-maths-institute-ohwp.vercel.app'
];

const corsOptions: cors.CorsOptions = {
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, curl, Postman)
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.log(`CORS blocked origin: ${origin}`);
            // Return an Error object as first parameter when rejecting
            callback(new Error(`CORS blocked: Origin ${origin} not allowed`), false);
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
    maxAge: 86400 // Cache preflight response for 24 hours
};

// Apply CORS middleware
app.use(cors(corsOptions));



app.use(express.json());

// Request logging middleware
app.use((req: Request, res: Response, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Health Check (Bypass DB)
app.get('/api/health', (req: Request, res: Response) => {
    res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        env: {
            node_env: process.env.NODE_ENV,
            vercel: process.env.VERCEL,
            mongo_uri_set: !!process.env.MONGO_URI,
            db_name: process.env.MONGO_URI ? process.env.MONGO_URI.split('/').pop()?.split('?')[0] : 'unknown'
        }
    });
});

// Connect to Database Middleware (AFTER CORS so preflight works even if DB is slow)
app.use(async (req: Request, res: Response, next: NextFunction) => {
    if (req.method === 'OPTIONS') {
        return next();
    }
    try {
        await connectDB();
        next();
    } catch (error) {
        console.error('Database connection failed:', error);
        res.status(500).json({
            error: 'Database connection failed',
            details: error instanceof Error ? error.message : String(error),
            hint: 'Check if MONGO_URI environment variable is set in Vercel',
            mongo_uri_set: !!process.env.MONGO_URI
        });
    }
});

import authRoutes from './routes/authRoutes';
import courseRoutes from './routes/courseRoutes';
import uploadRoutes from './routes/uploadRoutes';
import paymentRoutes from './routes/paymentRoutes';
import aboutRoutes from './routes/aboutRoutes';
import scholarRoutes from './routes/scholarRoutes';
import policyRoutes from './routes/policyRoutes';
import testimonialRoutes from './routes/testimonialRoutes';
import moduleRoutes from './routes/moduleRoutes';
import promotionalVideoRoutes from './routes/promotionalVideoRoutes';
import chatRoutes from './routes/chatRoutes';
import messageRoutes from './routes/messageRoutes';
import userRoutes from './routes/userRoutes';
import ragRoutes from './routes/ragRoutes';
import notificationRoutes from './routes/notificationRoutes';

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/about', aboutRoutes);
app.use('/api/scholars', scholarRoutes);
app.use('/api/policies', policyRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/modules', moduleRoutes);
app.use('/api/promo-video', promotionalVideoRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/users', userRoutes);
app.use('/api/rag', ragRoutes);
app.use('/api/notifications', notificationRoutes);

// Trigger Restart v2
app.get('/', (req: Request, res: Response) => {
    res.send('Dr Maths Institute API is running... (v5)');
});

// Only listen when not running on Vercel (Vercel handles this automatically)
if (process.env.VERCEL !== '1') {
    console.log('Starting Dr Maths Backend (Standalone Mode)...');
    connectDB().catch(err => {
        console.error('Initial DB Connection Failed (Will retry on request):', err.message);
    });
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

// Export for Vercel serverless functions
export default app;
 