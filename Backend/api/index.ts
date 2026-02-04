import app from '../src/server';
import { VercelRequest, VercelResponse } from '@vercel/node';

// Vercel serverless handler
export default function handler(req: VercelRequest, res: VercelResponse) {
    return app(req, res);
}
