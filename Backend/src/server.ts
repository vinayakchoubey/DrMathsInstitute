import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

// Connect to Database
console.log('Starting Dr Maths Backend...');
connectDB();

// Middleware
const allowedOrigins = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'https://drmaths-frontend.vercel.app',
    process.env.CLIENT_URL
].filter(Boolean) as string[];

// Use cors middleware - this properly handles preflight OPTIONS requests
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            // For any other origin, use the production frontend URL
            callback(null, 'https://drmaths-frontend.vercel.app');
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    maxAge: 86400 // Cache preflight response for 24 hours
}));

// Handle preflight requests explicitly as a backup
app.options('*', cors());

app.use(express.json());

// Request logging middleware
app.use((req: Request, res: Response, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    if (req.body && Object.keys(req.body).length > 0) {
        console.log('Body:', JSON.stringify(req.body, null, 2));
    }
    next();
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
    res.send('Dr Maths Institute API is running... (v4)');
});

// Only listen when not running on Vercel (Vercel handles this automatically)
if (process.env.VERCEL !== '1') {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

// Export for Vercel serverless functions
export default app;
