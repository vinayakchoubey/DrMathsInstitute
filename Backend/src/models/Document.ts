import mongoose, { Document, Schema } from 'mongoose';

export interface IDocumentMetadata extends Document {
    filename: string;
    uploadedAt: Date;
    pageCount: number;
}

const DocumentMetadataSchema = new Schema({
    filename: { type: String, required: true },
    pageCount: { type: Number, default: 0 },
}, { timestamps: { createdAt: 'uploadedAt', updatedAt: false } });

export const DocumentMetadata = mongoose.model<IDocumentMetadata>('DocumentMetadata', DocumentMetadataSchema);

export interface IDocumentChunk extends Document {
    documentId: mongoose.Types.ObjectId;
    content: string;
    embedding: number[];
    chunkIndex: number;
}

const DocumentChunkSchema = new Schema({
    documentId: { type: Schema.Types.ObjectId, ref: 'DocumentMetadata', required: true },
    content: { type: String, required: true },
    embedding: { type: [Number], required: true }, // Vector embedding
    chunkIndex: { type: Number, required: true },
});

export const DocumentChunk = mongoose.model<IDocumentChunk>('DocumentChunk', DocumentChunkSchema);
