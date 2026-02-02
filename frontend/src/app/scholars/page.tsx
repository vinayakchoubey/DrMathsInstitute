"use client";

import ScholarList from "@/components/scholars/ScholarList";

export default function ScholarsPage() {
    return (
        <div className="min-h-screen bg-background py-16 px-4 sm:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
                            Our Top Scholars
                        </span>
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Meet the brilliant minds who have achieved excellence with Dr Maths Institute.
                    </p>
                </div>

                <ScholarList />
            </div>
        </div>
    );
}

