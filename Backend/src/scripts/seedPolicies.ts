import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Policy from '../models/Policy';

dotenv.config();

const seedPolicies = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI as string);
        console.log('MongoDB Connected');

        const policies = [
            {
                title: 'Privacy Policy',
                content: '<h3>Privacy Policy</h3><p>Your privacy is critically important to us. We don\'t share your personal information with anyone except to comply with the law, develop our products, or protect our rights.</p>'
            },
            {
                title: 'Terms & Conditions',
                content: '<h3>Terms & Conditions</h3><p>By accessing this website we assume you accept these terms and conditions. Do not continue to use Dr Maths Institute if you do not agree to take all of the terms and conditions stated on this page.</p>'
            }
        ];

        for (const policyData of policies) {
            const existing = await Policy.findOne({ title: policyData.title });
            if (!existing) {
                await Policy.create(policyData);
                console.log(`Created policy: ${policyData.title}`);
            } else {
                console.log(`Policy already exists: ${policyData.title}`);
            }
        }

        console.log('Policies seeding completed');
        process.exit();
    } catch (error) {
        console.error('Error seeding policies:', error);
        process.exit(1);
    }
};

seedPolicies();
