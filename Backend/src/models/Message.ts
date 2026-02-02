import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false // Allow guest messages
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    contactNumber: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    reply: {
        type: String, // Admin's reply
        default: null
    },
    isRead: {
        type: Boolean, // For admin to know if they read it, or user to see new reply
        default: false
    },
    status: {
        type: String,
        enum: ['pending', 'replied'],
        default: 'pending'
    }
}, {
    timestamps: true
});

const Message = mongoose.model('Message', messageSchema);

export default Message;
