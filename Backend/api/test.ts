import { VercelRequest, VercelResponse } from '@vercel/node';

export default function (req: VercelRequest, res: VercelResponse) {
    res.status(200).json({
        message: "Isolated Test Successful",
        timestamp: new Date().toISOString(),
        env: process.env.NODE_ENV
    });
}
