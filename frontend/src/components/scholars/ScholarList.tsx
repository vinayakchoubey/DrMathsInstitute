"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface Scholar {
    _id: string;
    name: string;
    image: string;
    description: string;
}

export default function ScholarList() {
    const [scholars, setScholars] = useState<Scholar[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchScholars = async () => {
            try {
                const { data } = await axios.get("http://127.0.0.1:5000/api/scholars");
                setScholars(data);
            } catch (error) {
                console.error("Failed to fetch scholars", error);
            } finally {
                setLoading(false);
            }
        };

        fetchScholars();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center p-8">
                <Loader2 className="animate-spin md:w-10 md:h-10 text-primary" />
            </div>
        );
    }

    if (scholars.length === 0) {
        return <p className="text-center text-gray-500 py-8">No scholars found.</p>;
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {scholars.map((scholar, index) => (
                <motion.div
                    key={scholar._id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-card border border-white/10 rounded-2xl overflow-hidden hover:shadow-xl transition-shadow"
                >
                    <div className="h-64 w-full overflow-hidden">
                        <img
                            src={scholar.image}
                            alt={scholar.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                    </div>
                    <div className="p-6">
                        <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 mb-2">
                            {scholar.name}
                        </h3>
                        <p className="text-gray-400 text-sm line-clamp-3">
                            {scholar.description}
                        </p>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
