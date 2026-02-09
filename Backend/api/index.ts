import app from '../src/server';
import { VercelRequest, VercelResponse } from '@vercel/node';

// Vercel serverless handler with error catching
export default function handler(req: VercelRequest, res: VercelResponse) {
    try {
        return app(req, res);
    } catch (error: any) {
        console.error('Serverless handler error:', error);
        res.status(500).json({
            error: 'Server initialization failed',
            message: error.message,
            stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined
        });
    }
}
