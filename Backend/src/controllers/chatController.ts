import express, { Request, Response } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

// Lazy initialization to prevent startup crash if API key is missing
let genAI: GoogleGenerativeAI | null = null;

function getGenAI(): GoogleGenerativeAI {
    if (!genAI) {
        const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
        if (!apiKey) {
            throw new Error("Missing Gemini API Key (GEMINI_API_KEY or GOOGLE_API_KEY)");
        }
        genAI = new GoogleGenerativeAI(apiKey);
    }
    return genAI;
}

export const chatWithGemini = async (req: Request, res: Response) => {
    try {
        const { message, history } = req.body;

        // For text-only input, use the gemini-pro model
        const model = getGenAI().getGenerativeModel({ model: "gemini-pro" });

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
