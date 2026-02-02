import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Testimonial from '../models/Testimonial';

dotenv.config();

const seedTestimonials = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI as string);
        console.log('MongoDB Connected');

        // Check if testimonials already exist
        const count = await Testimonial.countDocuments();
        if (count > 0) {
            console.log('Testimonials already exist. Skipping seed.');
            process.exit();
        }

        const testimonials = [
            {
                name: 'Gursewak Singh',
                role: 'Intern at Byteoski Developers',
                content: 'The DSA Supreme Batch course by Love Babbar is exceptional! The comprehensive curriculum, engaging teaching style, practical approach, and supportive community have significantly boosted my confidence and skills in data structures and algorithms.',
                image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Gursewak'
            },
            {
                name: 'Ashish Dubey',
                role: 'SDE Intern at Microsoft',
                content: 'Babbar bhaiya has just helped me improve my DSA and problem solving skills a lot and helped me to grab internship at Microsoft. It helped me a lot in improving my DSA and development skills.',
                image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ashish'
            },
            {
                name: 'Avi Juneja',
                role: 'SDE Intern',
                content: 'I have been following Babbar bhaiya from my first year of College. I belong to ECE branch and had no one to guide me for my future. Babbar Bhaiya\'s achievements from Amazon to Microsoft and now Codehelp, motivated me to achieve my goals.',
                image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Avi'
            },
            {
                name: 'Rahul Kumar',
                role: 'SDE-1 at Amazon',
                content: 'The way concepts are explained is just amazing. I was able to crack Amazon interview solely because of the clarity I got from these courses. Highly recommended!',
                image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul'
            },
            {
                name: 'Priya Sharma',
                role: 'Frontend Dev at Uber',
                content: 'Frontend mastery course is a game changer. The projects we built were complex and real-world ready. It gave me the confidence to apply for top product based companies.',
                image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya'
            },
            {
                name: 'Ankit Gupta',
                role: 'Backend Engineer',
                content: 'Backend development was always scary for me until I joined this course. Node.js and System Design concepts are explained so beautifully.',
                image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ankit'
            }
        ];

        await Testimonial.insertMany(testimonials);
        console.log('Testimonials seeded successfully');
        process.exit();
    } catch (error) {
        console.error('Error seeding testimonials:', error);
        process.exit(1);
    }
};

seedTestimonials();
