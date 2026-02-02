"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { Loader2 } from "lucide-react";

export default function UserDashboard() {
    const [purchasedCourses, setPurchasedCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const storedUser = localStorage.getItem("user");
                if (!storedUser) return;

                const user = JSON.parse(storedUser);

                // Fetch Courses
                const { data: allCourses } = await axios.get("http://127.0.0.1:5000/api/courses");
                const purchasedIds = user.purchasedCourses || [];
                const myCourses = allCourses.filter((course: any) =>
                    purchasedIds.includes(course._id)
                );
                setPurchasedCourses(myCourses);

            } catch (error) {
                console.error("Error fetching data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <h1 className="text-3xl font-bold mb-8 border-b border-white/10 pb-4">My Learning</h1>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="animate-spin w-10 h-10 text-primary" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {purchasedCourses.length > 0 ? (
                        purchasedCourses.map((course) => (
                            <Link href={`/courses/${course._id}`} key={course._id}>
                                <div className="bg-card border border-white/10 rounded-xl overflow-hidden hover:border-primary/50 transition-all group">
                                    <div className="h-48 bg-gray-800 relative overflow-hidden">
                                        <img
                                            src={course.thumbnail}
                                            alt={course.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                                    </div>
                                    <div className="p-5">
                                        <h3 className="font-bold text-xl mb-3 line-clamp-2">{course.title}</h3>
                                        <div className="w-full bg-secondary/30 h-1.5 rounded-full overflow-hidden mb-4">
                                            <div className="bg-primary h-full w-0" style={{ width: '0%' }}></div> {/* Progress bar placeholder */}
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-gray-400">0% Complete</span>
                                            <span className="text-primary font-medium group-hover:underline">Continue Learning</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <div className="col-span-3 text-center py-20 bg-card rounded-2xl border border-dashed border-white/10">
                            <h3 className="text-xl font-semibold mb-2">No active courses</h3>
                            <p className="text-gray-400 mb-6">You haven't enrolled in any courses yet.</p>
                            <Link href="/courses" className="text-primary hover:underline bg-white/5 px-6 py-2 rounded-full border border-white/10 hover:bg-white/10 transition-colors">
                                Browse Courses
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
