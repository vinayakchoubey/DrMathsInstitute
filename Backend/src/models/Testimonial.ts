import mongoose from 'mongoose';

const testimonialSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    role: {
        type: String, // e.g., "SDE Intern at Microsoft"
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    image: {
        type: String, // URL to image
        required: true,
    },
}, {
    timestamps: true,
});

const Testimonial = mongoose.model('Testimonial', testimonialSchema);

export default Testimonial;
