import type { VercelRequest, VercelResponse } from '@vercel/node';
import app from '../src/server';

// Export handler for Vercel
export default function handler(req: VercelRequest, res: VercelResponse) {
    // Set CORS headers manually for all responses
    res.setHeader('Access-Control-Allow-Origin', 'https://drmaths-frontend.vercel.app');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Max-Age', '86400');

    // Handle preflight OPTIONS request
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // Pass to Express app
    return app(req, res);
}
