// Restart trigger for fixes
import { Request, Response } from 'express';
import fs from 'fs';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { DocumentMetadata, DocumentChunk } from '../models/Document';

// Lazy initialization for Gemini (to handle serverless cold starts)
let genAI: GoogleGenerativeAI | null = null;

function getGenAI(): GoogleGenerativeAI {
    if (!genAI) {
        const API_KEY = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
        if (!API_KEY) {
            console.error("CRITICAL: No API Key found for Gemini in GOOGLE_API_KEY or GEMINI_API_KEY");
            throw new Error("Missing Gemini API Key");
        }
        genAI = new GoogleGenerativeAI(API_KEY);
    }
    return genAI;
}

// Helper to get embedding
// Helper to get embedding with retry logic and rate limiting
async function getEmbedding(text: string, retries = 5, delay = 5000) {
    for (let i = 0; i < retries; i++) {
        try {
            const model = getGenAI().getGenerativeModel({ model: "embedding-001" });
            const result = await model.embedContent(text);
            return result.embedding.values;
        } catch (error: any) {
            // Check for 429 or quota related errors
            if (error.message?.includes('429') || error.status === 429 || error.message?.includes('Quota exceeded')) {
                if (i === retries - 1) throw error;

                // Try to parse retry delay from error details if available
                let waitTime = delay;
                if (error.errorDetails) {
                    const retryInfo = error.errorDetails.find((d: any) => d['@type']?.includes('RetryInfo'));
                    if (retryInfo && retryInfo.retryDelay) {
                        const match = retryInfo.retryDelay.match(/([\d.]+)s/);
                        if (match) {
                            waitTime = parseFloat(match[1]) * 1000 + 1000; // Add 1s buffer
                        }
                    }
                }

                console.warn(`[Gemini] Rate limit hit. Retrying in ${waitTime / 1000}s...`);
                await new Promise(resolve => setTimeout(resolve, waitTime));
                delay *= 2; // Exponential backoff for fallback
            } else {
                throw error;
            }
        }
    }
    throw new Error("Failed to get embedding due to rate limits.");
}

// Simple Text Splitter (No Langchain dependency)
function splitText(text: string, chunkSize: number = 1000, chunkOverlap: number = 200): string[] {
    const chunks: string[] = [];
    let start = 0;
    while (start < text.length) {
        const end = Math.min(start + chunkSize, text.length);
        chunks.push(text.slice(start, end));
        start += chunkSize - chunkOverlap;
    }
    return chunks;
}

// Helper for logging to file
function logToFile(message: string) {
    const logPath = './backend_debug.log';
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [RAG] ${message}\n`;
    try {
        fs.appendFileSync(logPath, logMessage);
    } catch (e) {
        console.error("Failed to write to log file", e);
    }
}

// Upload and Process PDF
export const uploadDocument = async (req: Request, res: Response) => {
    logToFile("Start uploadDocument");
    console.log("Start uploadDocument - v1.1.1 check");
    try {
        if (!req.file) {
            logToFile("Error: No file received");
            console.error("No file received");
            return res.status(400).json({ message: "No PDF file uploaded" });
        }
        logToFile(`File received: ${req.file.path} (${req.file.originalname})`);
        console.log("File received:", req.file.path, req.file.originalname);

        const buffer = fs.readFileSync(req.file.path);
        logToFile("File read into buffer");
        console.log("File read into buffer");

        let text = "";
        try {
            logToFile("Attempting to require pdf-parse");

            // Polyfill for DOMMatrix which is missing in Node environment but required by some pdf-parse versions
            // @ts-ignore
            if (!global.DOMMatrix) {
                // @ts-ignore
                global.DOMMatrix = class DOMMatrix {
                    constructor() { }
                    // Basic methods used by pdf.js just in case
                    toString() { return "matrix(1, 0, 0, 1, 0, 0)"; }
                    multiply(other: any) { return this; }
                    translate(tx: any, ty: any) { return this; }
                    scale(sx: any, sy: any) { return this; }
                };
            }

            console.log("Attempting to require pdf-parse");
            // @ts-ignore
            let pdf = require('pdf-parse');

            // Handle CommonJS/ESM interop
            if (typeof pdf !== 'function' && pdf.default) {
                pdf = pdf.default;
            }

            logToFile("pdf-parse required, parsing buffer...");
            // console.log("pdf-parse required, parsing buffer...");

            const pdfData = await pdf(buffer);
            logToFile(`PDF parsed, page count: ${pdfData.numpages}`);
            console.log("PDF parsed, page count:", pdfData.numpages);
            text = pdfData.text;
        } catch (e: any) {
            logToFile(`PDF Parse Error Detail: ${e.message}`);
            console.error("PDF Parse Error Detail:", e);
            // Attempt cleanup
            try { fs.unlinkSync(req.file.path); } catch { }
            return res.status(500).json({ message: "Failed to parse PDF: " + e.message });
        }

        logToFile("Saving Metadata...");
        console.log("Saving Metadata...");
        // 1. Save Metadata
        const docMetadata = await DocumentMetadata.create({
            filename: req.file.originalname,
            pageCount: 0 // We'll update if possible, or leave 0
        });
        logToFile(`Metadata saved: ${docMetadata._id}`);
        console.log("Metadata saved:", docMetadata._id);

        // 2. Chunk Text
        logToFile("Splitting text...");
        console.log("Splitting text...");
        const chunks = splitText(text);
        logToFile(`Text split into ${chunks.length} chunks`);
        console.log("Text split into", chunks.length, "chunks");

        // 3. Generate Embeddings & Save Chunks
        let chunksSaved = 0;
        logToFile("Starting embedding generation loop...");
        console.log("Starting embedding generation loop...");
        for (const [index, chunkContent] of chunks.entries()) {
            if (!chunkContent.trim()) continue; // Skip empty chunks

            // Artificial delay to respect free tier (approx 15-30 RPM)
            if (index > 0) await new Promise(resolve => setTimeout(resolve, 4000));

            try {
                // console.log("Embedding chunk", index); 
                const embedding = await getEmbedding(chunkContent);
                await DocumentChunk.create({
                    documentId: docMetadata._id,
                    content: chunkContent,
                    embedding: embedding,
                    chunkIndex: index
                });
                chunksSaved++;
            } catch (embedError: any) {
                logToFile(`Embedding Error for chunk ${index}: ${embedError.message}`);
                console.error("Embedding Error for chunk", index, embedError.message);
                // Continue with other chunks
            }
        }
        logToFile(`Chunks saved: ${chunksSaved}`);
        console.log("Chunks saved:", chunksSaved);

        // Cleanup temporary file
        try {
            fs.unlinkSync(req.file.path);
        } catch (e) { }

        res.status(201).json({
            message: "Document processed successfully",
            documentId: docMetadata._id,
            chunks: chunksSaved
        });

    } catch (error: any) {
        logToFile(`General Upload error: ${error.message} \nStack: ${error.stack}`);
        console.error("General Upload error:", error);
        res.status(500).json({ message: "Server Error: " + error.message });
    }
};

// Chat with RAG
export const chatWithBot = async (req: Request, res: Response) => {
    try {
        const { query } = req.body;
        console.log("Query:");
        if (!query) return res.status(400).json({ message: "Query is required" });

        // 1. Embed Query
        const queryEmbedding = await getEmbedding(query);
        console.log("Query:", query);
        console.log("Query Embedding:", queryEmbedding);

        // 2. Vector Search (Manual Cosine Similarity for MongoDB)
        // Note: For production, use MongoDB Atlas Vector Search ($vectorSearch).
        const chunks = await DocumentChunk.find({});

        const scoredChunks = chunks.map(chunk => {
            const similarity = cosineSimilarity(queryEmbedding, chunk.embedding);
            return { ...chunk.toObject(), similarity };
        });

        // Sort by similarity descending
        scoredChunks.sort((a, b) => b.similarity - a.similarity);
        const topChunks = scoredChunks.slice(0, 5); // Top 5 chunks

        // 3. Construct Context
        const context = topChunks.map(c => c.content).join("\n\n---\n\n");

        if (topChunks.length === 0 || topChunks[0].similarity < 0.55) {
            // Weak context
        }

        // 4. Generate Response
        const model = getGenAI().getGenerativeModel({ model: "gemini-pro" });

        const systemPrompt = `You are a strict, helpful AI assistant for Dr. Maths Institute. You must answer the user's question explicitly and ONLY using the provided context below.
        
        Rules:
        1. If the answer is not contained in the context, say exactly: "This information is not available in the provided documents."
        2. Do not use outside knowledge.
        3. Do not assume information.
        4. Maintain a professional tone.
        5. If the user greets you or asks "How are you", you may respond politely briefly, then ask for their query regarding the documents.
        
        Context:
        ${context}

        User Question: ${query}
        `;

        const result = await model.generateContent(systemPrompt);
        const response = result.response.text();

        res.json({ answer: response });

    } catch (error: any) {
        console.error("Chat error:", error);
        res.status(500).json({ message: error.message });
    }
};

// Get Documents List
export const getDocuments = async (req: Request, res: Response) => {
    try {
        const docs = await DocumentMetadata.find().sort({ uploadedAt: -1 });
        res.json(docs);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Simple Cosine Similarity Function
function cosineSimilarity(vecA: number[], vecB: number[]) {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < vecA.length; i++) {
        dotProduct += vecA[i] * vecB[i];
        normA += vecA[i] * vecA[i];
        normB += vecB[i] * vecB[i];
    }
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}