import express, { Request, Response } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

// Access your API key as an environment variable
const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

export const chatWithGemini = async (req: Request, res: Response) => {
    try {
        const { message, history } = req.body;

        if (!apiKey) {
            console.error("Gemini API Key is missing. Checked GEMINI_API_KEY and GOOGLE_API_KEY.");
            return res.status(500).json({ message: "Server configuration error: API Key missing." });
        }

        // For text-only input, use the gemini-pro model
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        let chat;
        if (history && Array.isArray(history)) {
            chat = model.startChat({
                history: history,
            });
        } else {
            chat = model.startChat();
        }

        const result = await chat.sendMessage(message);
        const response = await result.response;
        const text = response.text();

        res.json({ reply: text });

    } catch (error: any) {
        console.error("Gemini Chat Error Details:", error);
        // Send a more specific error message if available, otherwise generic
        const errorMessage = error.message || "Failed to process chat message.";
        res.status(500).json({ message: errorMessage });
    }
};
