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

// Middleware - CORS configuration
const allowedOrigins = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'https://drmaths-frontend.vercel.app'
];

// Add CLIENT_URL if it exists and is not already in the list
if (process.env.CLIENT_URL && !allowedOrigins.includes(process.env.CLIENT_URL)) {
    allowedOrigins.push(process.env.CLIENT_URL);
}

const corsOptions = {
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
    optionsSuccessStatus: 200, // Some legacy browsers choke on 204
    maxAge: 86400
};

// Enable pre-flight across-the-board
app.options('*', cors(corsOptions));

// Apply CORS middleware
app.use(cors(corsOptions));

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
