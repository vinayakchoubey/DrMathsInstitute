import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
    recipient: {
        type: String, // 'admin' or UserId
        required: true
    },
    message: {
        type: String,
        required: true
    },
    link: {
        type: String, // e.g., '/admin/messages' or '/dashboard/messages'
        default: ''
    },
    isRead: {
        type: Boolean,
        default: false
    },
    type: {
        type: String,
        enum: ['message', 'reply', 'system'],
        default: 'system'
    }
}, {
    timestamps: true
});

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;
