import mongoose from 'mongoose';

const scholarSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});

const Scholar = mongoose.model('Scholar', scholarSchema);

export default Scholar;
