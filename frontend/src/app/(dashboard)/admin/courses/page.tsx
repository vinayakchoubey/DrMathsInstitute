"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Plus, Trash2, Edit, Upload, FileText, Video, Save, X, Eye, Users, Search, Star, BookOpen, Calendar, Clock } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ManageCoursesPage() {
    const [courses, setCourses] = useState<any[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    // Buyers Modal State
    const [buyersModal, setBuyersModal] = useState({ isOpen: false, courseName: "", buyers: [] as any[] });
    const [loadingBuyers, setLoadingBuyers] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        price: "",
        originalPrice: "",
        thumbnail: "",
        category: "",
        language: "",
        examTarget: "",
        startDate: "",
        type: "online",
        isFeatured: false,
        highlights: [] as string[],
    });
    const [newHighlight, setNewHighlight] = useState("");
    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
    const [instructorsList, setInstructorsList] = useState<any[]>([]);
    const [newInstructor, setNewInstructor] = useState({ name: "", bio: "", imageFile: null as File | null, image: "" });
    const [editingInstructorIndex, setEditingInstructorIndex] = useState<number | null>(null);
    const [contentList, setContentList] = useState<any[]>([]);
    const [newItem, setNewItem] = useState({ title: "", type: "pdf", file: null as File | null });

    // Schedule State
    const [schedule, setSchedule] = useState<{ day: string, slots: any[] }[]>([]);
    const [selectedDay, setSelectedDay] = useState("Monday");
    const [newSlot, setNewSlot] = useState({ time: "", subject: "", instructor: "" });
    const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000"}/api/courses`);
            setCourses(data);
        } catch (e) { console.error(e); }
    };

    const handleUpload = async (file: File) => {
        const formData = new FormData();
        formData.append("file", file);
        try {
            const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000"}/api/upload`, formData);
            return data.url;
        } catch (e) {
            console.error("Upload failed", e);
            return null;
        }
    };

    const handleAddInstructor = () => {
        if (newInstructor.name) {
            if (editingInstructorIndex !== null) {
                // Update existing
                const list = [...instructorsList];
                list[editingInstructorIndex] = newInstructor;
                setInstructorsList(list);
                setEditingInstructorIndex(null);
            } else {
                // Add new
                setInstructorsList([...instructorsList, newInstructor]);
            }
            setNewInstructor({ name: "", bio: "", imageFile: null, image: "" });
        }
    };

    const handleEditInstructor = (index: number) => {
        setNewInstructor(instructorsList[index]);
        setEditingInstructorIndex(index);
    };

    const handleCancelEditInstructor = () => {
        setNewInstructor({ name: "", bio: "", imageFile: null, image: "" });
        setEditingInstructorIndex(null);
    }

    const handleRemoveInstructor = (index: number) => {
        const list = [...instructorsList];
        list.splice(index, 1);
        setInstructorsList(list);
    };

    const handleAddHighlight = () => {
        if (newHighlight.trim()) {
            setFormData({
                ...formData,
                highlights: [...(formData.highlights || []), newHighlight.trim()]
            });
            setNewHighlight("");
        }
    };

    const handleRemoveHighlight = (index: number) => {
        const newHighlights = [...(formData.highlights || [])];
        newHighlights.splice(index, 1);
        setFormData({ ...formData, highlights: newHighlights });
    };

    const handleAddContent = () => {
        if (newItem.title && newItem.file) {
            setContentList([...contentList, newItem]);
            setNewItem({ title: "", type: "pdf", file: null });
        }
    };

    const handleRemoveContent = (index: number) => {
        const newList = [...contentList];
        newList.splice(index, 1);
        setContentList(newList);
    };

    const handleAddSlot = () => {
        if (newSlot.time && newSlot.subject && newSlot.instructor) {
            const updatedSchedule = [...schedule];
            const dayIndex = updatedSchedule.findIndex(s => s.day === selectedDay);

            if (dayIndex > -1) {
                updatedSchedule[dayIndex].slots.push(newSlot);
            } else {
                updatedSchedule.push({ day: selectedDay, slots: [newSlot] });
            }

            setSchedule(updatedSchedule);
            setNewSlot({ time: "", subject: "", instructor: "" });
        }
    };

    const handleRemoveSlot = (day: string, index: number) => {
        const updatedSchedule = [...schedule];
        const dayIndex = updatedSchedule.findIndex(s => s.day === day);
        if (dayIndex > -1) {
            updatedSchedule[dayIndex].slots.splice(index, 1);
            if (updatedSchedule[dayIndex].slots.length === 0) {
                updatedSchedule.splice(dayIndex, 1);
            }
            setSchedule(updatedSchedule);
        }
    };

    const [editingId, setEditingId] = useState<string | null>(null);

    const resetForm = () => {
        setFormData({
            title: "", description: "", price: "", originalPrice: "", thumbnail: "",
            category: "", language: "", examTarget: "", startDate: "", type: "online", isFeatured: false, highlights: []
        });
        setThumbnailFile(null);
        setInstructorsList([]);
        setContentList([]);
        setSchedule([]); // Reset schedule
        setEditingId(null);
    }

    const handleEdit = (course: any) => {
        setEditingId(course._id);
        const startDateValue = course.startDate ? new Date(course.startDate).toISOString().split('T')[0] : "";
        setFormData({
            title: course.title,
            description: course.description,
            price: course.price,
            originalPrice: course.originalPrice || "",
            thumbnail: course.thumbnail,
            category: course.category || "",
            language: course.language || "",
            examTarget: course.examTarget || "",
            startDate: startDateValue,
            type: course.type || "online",
            isFeatured: course.isFeatured || false,
            highlights: course.highlights || [],
        });

        // Handle instructors - if array exists use it, else use legacy single teacher fields
        if (course.instructors && course.instructors.length > 0) {
            setInstructorsList(course.instructors);
        } else if (course.teacherName) {
            setInstructorsList([{
                name: course.teacherName,
                bio: course.teacherBio,
                image: course.teacherImage, // Passing URL as string is fine, UI needs to handle "file" missing
                imageFile: null
            }]);
        }


        setSchedule(course.schedule || []); // Load schedule
        setContentList(course.content || []);
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem("token");
            const config = { headers: { Authorization: `Bearer ${token}` } };

            let thumbnailUrl = formData.thumbnail;
            if (thumbnailFile) {
                thumbnailUrl = await handleUpload(thumbnailFile);
            }

            // Process Instructors
            const finalInstructors = [];
            for (const inst of instructorsList) {
                let imgUrl = inst.image || ""; // Keep existing URL if it's there
                if (inst.imageFile) {
                    imgUrl = await handleUpload(inst.imageFile);
                }
                finalInstructors.push({
                    name: inst.name,
                    bio: inst.bio,
                    image: imgUrl
                });
            }

            const finalContent = [];
            for (const item of contentList) {
                let url = item.url || "";
                if (item.file) {
                    url = await handleUpload(item.file);
                }
                if (url) {
                    finalContent.push({
                        title: item.title,
                        type: item.type,
                        url: url,
                    });
                }
            }

            const coursePayload = {
                ...formData,
                price: Number(formData.price),
                originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
                thumbnail: thumbnailUrl,
                instructors: finalInstructors,
                teacherName: finalInstructors[0]?.name || "Unknown", // Legacy fallback
                teacherBio: finalInstructors[0]?.bio || "", // Legacy fallback
                teacherImage: finalInstructors[0]?.image || "", // Legacy fallback

                content: finalContent,
                schedule: schedule, // Include schedule
            };

            if (editingId) {
                await axios.put(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000"}/api/courses/${editingId}`, coursePayload, config);
                alert("Course updated successfully!");
            } else {
                await axios.post(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000"}/api/courses`, coursePayload, config);
                alert("Course created successfully!");
            }

            setShowForm(false);
            resetForm();
            fetchCourses();

        } catch (error) {
            console.error("Failed to save course", error);
            alert("Failed to save course");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure?")) return;
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000"}/api/courses/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchCourses();
        } catch (e) {
            alert("Delete failed");
        }
    }

    const handleToggleFeatured = async (course: any) => {
        try {
            const token = localStorage.getItem("token");
            await axios.put(
                `${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000"}/api/courses/${course._id}`,
                { isFeatured: !course.isFeatured },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchCourses();
        } catch (error) {
            console.error("Failed to update featured status", error);
            alert("Failed to update featured status");
        }
    };

    const handleViewBuyers = async (courseId: string, courseName: string) => {
        setLoadingBuyers(true);
        setBuyersModal({ isOpen: true, courseName, buyers: [] });
        try {
            const token = localStorage.getItem("token");
            const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000"}/api/courses/${courseId}/buyers`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setBuyersModal({ isOpen: true, courseName, buyers: data });
        } catch (error) {
            console.error(error);
            alert("Failed to fetch buyers");
        } finally {
            setLoadingBuyers(false);
        }
    };

    const filteredCourses = courses.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.teacherName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                        Manage Courses
                    </h1>
                    <p className="text-gray-400 mt-2">Create, edit, and manage your course offerings</p>
                </div>
                <button
                    onClick={() => {
                        if (showForm) { resetForm(); setShowForm(false); }
                        else { resetForm(); setShowForm(true); }
                    }}
                    className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-full shadow-lg shadow-purple-500/20 flex items-center gap-2 transition-all transform hover:scale-105"
                >
                    {showForm ? <X size={20} /> : <Plus size={20} />}
                    {showForm ? "Cancel" : "Add New Course"}
                </button>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-card border border-white/10 p-6 rounded-2xl shadow-xl">
                    <h3 className="text-gray-400 text-sm font-medium mb-1">Total Courses</h3>
                    <p className="text-3xl font-bold text-white">{courses.length}</p>
                </div>
                <div className="bg-card border border-white/10 p-6 rounded-2xl shadow-xl">
                    <h3 className="text-gray-400 text-sm font-medium mb-1">Featured Courses</h3>
                    <p className="text-3xl font-bold text-yellow-400">{courses.filter(c => c.isFeatured).length}</p>
                </div>
                <div className="bg-card border border-white/10 p-6 rounded-2xl shadow-xl">
                    <h3 className="text-gray-400 text-sm font-medium mb-1">Total Content Items</h3>
                    <p className="text-3xl font-bold text-blue-400">
                        {courses.reduce((acc, curr) => acc + (curr.content ? curr.content.length : 0), 0)}
                    </p>
                </div>
            </div>

            {showForm && (
                <div className="bg-card border border-white/10 rounded-2xl p-8 mb-8 shadow-2xl animate-in slide-in-from-top-4 duration-300">
                    <h2 className="text-2xl font-bold mb-6 text-white border-b border-white/10 pb-4">{editingId ? "Edit Course" : "Create New Course"}</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Course Title</label>
                                <input
                                    placeholder="e.g. Advanced Calculus"
                                    className="bg-secondary/50 border border-white/10 rounded-xl px-4 py-3 w-full focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                    value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">Price (₹)</label>
                                    <input
                                        placeholder="0"
                                        type="number"
                                        className="bg-secondary/50 border border-white/10 rounded-xl px-4 py-3 w-full focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                        value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">Original Price</label>
                                    <input
                                        placeholder="0"
                                        type="number"
                                        className="bg-secondary/50 border border-white/10 rounded-xl px-4 py-3 w-full focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                        value={formData.originalPrice} onChange={e => setFormData({ ...formData, originalPrice: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <input
                                placeholder="Category"
                                className="bg-secondary/50 border border-white/10 rounded-xl px-4 py-3 w-full focus:ring-2 focus:ring-primary outline-none"
                                value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}
                            />
                            <div className="relative">
                                <select
                                    className="bg-secondary/50 border border-white/10 rounded-xl px-4 py-3 w-full focus:ring-2 focus:ring-primary outline-none appearance-none"
                                    value={formData.type || 'online'}
                                    onChange={e => setFormData({ ...formData, type: e.target.value })}
                                >
                                    <option value="online" className="bg-gray-900">Online Course</option>
                                    <option value="offline" className="bg-gray-900">Offline Class</option>
                                    <option value="hybrid" className="bg-gray-900">Hybrid (Both)</option>
                                </select>
                            </div>
                            <input
                                placeholder="Language"
                                className="bg-secondary/50 border border-white/10 rounded-xl px-4 py-3 w-full focus:ring-2 focus:ring-primary outline-none"
                                value={formData.language} onChange={e => setFormData({ ...formData, language: e.target.value })}
                            />
                            <input
                                placeholder="Exam Target"
                                className="bg-secondary/50 border border-white/10 rounded-xl px-4 py-3 w-full focus:ring-2 focus:ring-primary outline-none"
                                value={formData.examTarget} onChange={e => setFormData({ ...formData, examTarget: e.target.value })}
                            />
                            <input
                                type="date"
                                className="bg-secondary/50 border border-white/10 rounded-xl px-4 py-3 w-full focus:ring-2 focus:ring-primary outline-none"
                                value={formData.startDate} onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                            />
                        </div>



                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Description</label>
                            <textarea
                                placeholder="Course details..."
                                className="bg-secondary/50 border border-white/10 rounded-xl px-4 py-3 w-full h-32 focus:ring-2 focus:ring-primary outline-none"
                                value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} required
                            />
                        </div>

                        {/* Instructors Builder */}
                        <div className="bg-secondary/20 p-6 rounded-xl border border-white/5">
                            <h3 className="font-bold mb-4 text-primary flex items-center gap-2">
                                <Users size={20} /> Course Instructors
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4 items-end">
                                <div className="md:col-span-3">
                                    <input
                                        placeholder="Name"
                                        className="bg-secondary/50 border border-white/10 rounded-lg px-3 py-2 w-full"
                                        value={newInstructor.name} onChange={e => setNewInstructor({ ...newInstructor, name: e.target.value })}
                                    />
                                </div>
                                <div className="md:col-span-4">
                                    <input
                                        placeholder="Bio (Short description)"
                                        className="bg-secondary/50 border border-white/10 rounded-lg px-3 py-2 w-full"
                                        value={newInstructor.bio} onChange={e => setNewInstructor({ ...newInstructor, bio: e.target.value })}
                                    />
                                </div>
                                <div className="md:col-span-3">
                                    <div className="relative">
                                        <input
                                            type="file"
                                            className="text-sm w-full"
                                            onChange={e => setNewInstructor({ ...newInstructor, imageFile: e.target.files?.[0] || null })}
                                        />
                                        <p className="text-[10px] text-gray-500 mt-1">Image (Optional)</p>
                                    </div>
                                </div>
                                <div className="md:col-span-2 flex gap-2">
                                    <button type="button" onClick={handleAddInstructor} className={`flex-1 ${editingInstructorIndex !== null ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'} text-white px-4 py-2 rounded-lg text-sm transition-colors flex items-center justify-center gap-1`}>
                                        {editingInstructorIndex !== null ? <Save size={16} /> : <Plus size={16} />}
                                        {editingInstructorIndex !== null ? "Update" : "Add"}
                                    </button>
                                    {editingInstructorIndex !== null && (
                                        <button type="button" onClick={handleCancelEditInstructor} className="bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-lg text-sm transition-colors">
                                            <X size={16} />
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-3 mt-4">
                                {instructorsList.length === 0 && <p className="text-gray-500 text-sm text-center py-4">No instructors added.</p>}
                                {instructorsList.map((inst, idx) => (
                                    <div key={idx} className="flex justify-between items-center bg-black/30 p-4 rounded-lg border border-white/5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-white/10 overflow-hidden shrink-0">
                                                {(inst.image || inst.imageFile) ? (
                                                    <img src={inst.image || (inst.imageFile ? URL.createObjectURL(inst.imageFile) : "")} className="w-full h-full object-cover" />
                                                ) : <Users className="w-full h-full p-2 text-gray-500" />}
                                            </div>
                                            <div>
                                                <p className="font-bold text-white">{inst.name}</p>
                                                <p className="text-xs text-gray-400">{inst.bio}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button type="button" onClick={() => handleEditInstructor(idx)} className="text-blue-400 hover:bg-blue-500/10 p-2 rounded-full transition-colors"><Edit size={16} /></button>
                                            <button type="button" onClick={() => handleRemoveInstructor(idx)} className="text-red-400 hover:bg-red-500/10 p-2 rounded-full transition-colors"><Trash2 size={16} /></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Highlights Builder */}
                        <div className="bg-secondary/20 p-6 rounded-xl border border-white/5">
                            <h3 className="font-bold mb-4 text-primary flex items-center gap-2">
                                <Star size={20} /> Course Highlights (What you'll learn)
                            </h3>
                            <div className="flex gap-4 mb-4">
                                <input
                                    placeholder="e.g. Complete concept clarity"
                                    className="bg-secondary/50 border border-white/10 rounded-lg px-3 py-2 w-full"
                                    value={newHighlight}
                                    onChange={e => setNewHighlight(e.target.value)}
                                    onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), handleAddHighlight())}
                                />
                                <button type="button" onClick={handleAddHighlight} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition-colors flex items-center justify-center gap-1 shrink-0">
                                    <Plus size={16} /> Add
                                </button>
                            </div>
                            <div className="space-y-2">
                                {(!formData.highlights || formData.highlights.length === 0) && <p className="text-gray-500 text-sm text-center py-2">No highlights added yet.</p>}
                                {formData.highlights?.map((hl, idx) => (
                                    <div key={idx} className="flex justify-between items-center bg-black/30 p-3 rounded-lg border border-white/5">
                                        <p className="text-sm font-medium">{hl}</p>
                                        <button type="button" onClick={() => handleRemoveHighlight(idx)} className="text-red-400 hover:bg-red-500/10 p-2 rounded-full transition-colors"><X size={16} /></button>
                                    </div>
                                ))}
                            </div>
                        </div >

                        <div className="flex items-center gap-3 p-4 bg-secondary/30 rounded-xl border border-white/5">
                            <div className="relative flex items-center">
                                <input
                                    type="checkbox"
                                    id="isFeatured"
                                    checked={formData.isFeatured}
                                    onChange={e => setFormData({ ...formData, isFeatured: e.target.checked })}
                                    className="w-5 h-5 accent-primary cursor-pointer"
                                />
                            </div>
                            <label htmlFor="isFeatured" className="text-gray-300 cursor-pointer select-none">Feature this course on Landing Page</label>
                        </div>

                        <div className="border border-dashed border-white/20 p-6 rounded-xl hover:bg-white/5 transition-colors text-center cursor-pointer">
                            <p className="mb-2 text-sm text-gray-400">Thumbnail Image</p>
                            <input type="file" onChange={e => setThumbnailFile(e.target.files?.[0] || null)} required={!formData.thumbnail} className="mx-auto block text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90" />
                        </div>

                        {/* Content Builder */}
                        <div className="bg-secondary/20 p-6 rounded-xl border border-white/5">
                            <h3 className="font-bold mb-4 text-primary flex items-center gap-2">
                                <BookOpen size={20} /> Course Material
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4 items-end">
                                <div className="md:col-span-4">
                                    <input
                                        placeholder="Chapter Title"
                                        className="bg-secondary/50 border border-white/10 rounded-lg px-3 py-2 w-full"
                                        value={newItem.title} onChange={e => setNewItem({ ...newItem, title: e.target.value })}
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <select
                                        className="bg-secondary/50 border border-white/10 rounded-lg px-3 py-2 w-full"
                                        value={newItem.type} onChange={e => setNewItem({ ...newItem, type: e.target.value })}
                                    >
                                        <option value="pdf">PDF</option>
                                        <option value="video">Video</option>
                                    </select>
                                </div>
                                <div className="md:col-span-4">
                                    <input type="file" className="text-sm w-full" onChange={e => setNewItem({ ...newItem, file: e.target.files?.[0] || null })} />
                                </div>
                                <div className="md:col-span-2">
                                    <button type="button" onClick={handleAddContent} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm w-full transition-colors flex items-center justify-center gap-1">
                                        <Plus size={16} /> Add
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2 mt-4">
                                {contentList.length === 0 && <p className="text-gray-500 text-sm text-center py-4">No content added yet.</p>}
                                {contentList.map((item, idx) => (
                                    <div key={idx} className="flex justify-between items-center bg-black/30 p-3 rounded-lg border border-white/5">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-white/5 rounded-full">
                                                {item.type === 'pdf' ? <FileText size={16} className="text-red-400" /> : <Video size={16} className="text-blue-400" />}
                                            </div>
                                            <div>
                                                <p className="font-medium">{item.title}</p>
                                                <p className="text-xs text-gray-500">{item.file?.name}</p>
                                            </div>
                                        </div>
                                        <button type="button" onClick={() => handleRemoveContent(idx)} className="text-red-400 hover:bg-red-500/10 p-2 rounded-full transition-colors"><X size={16} /></button>
                                    </div>
                                ))}
                            </div>
                        </div>



                        {/* Schedule Builder */}
                        <div className="bg-secondary/20 p-6 rounded-xl border border-white/5">
                            <h3 className="font-bold mb-4 text-primary flex items-center gap-2">
                                <Calendar size={20} /> Class Timetable
                            </h3>

                            {/* Day Selector */}
                            <div className="flex overflow-x-auto gap-2 mb-6 pb-2 scrollbar-hide">
                                {daysOfWeek.map(day => (
                                    <button
                                        key={day}
                                        type="button"
                                        onClick={() => setSelectedDay(day)}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${selectedDay === day ? 'bg-primary text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
                                    >
                                        {day}
                                    </button>
                                ))}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4 items-end">
                                <div className="md:col-span-3">
                                    <label className="text-xs text-gray-500 block mb-1">Time</label>
                                    <input
                                        type="time"
                                        className="bg-secondary/50 border border-white/10 rounded-lg px-3 py-2 w-full text-sm"
                                        value={newSlot.time} onChange={e => setNewSlot({ ...newSlot, time: e.target.value })}
                                    />
                                </div>
                                <div className="md:col-span-4">
                                    <label className="text-xs text-gray-500 block mb-1">Subject</label>
                                    <input
                                        placeholder="e.g. Linear Algebra"
                                        className="bg-secondary/50 border border-white/10 rounded-lg px-3 py-2 w-full text-sm"
                                        value={newSlot.subject} onChange={e => setNewSlot({ ...newSlot, subject: e.target.value })}
                                    />
                                </div>
                                <div className="md:col-span-3">
                                    <label className="text-xs text-gray-500 block mb-1">Instructor</label>
                                    <select
                                        className="bg-secondary/50 border border-white/10 rounded-lg px-3 py-2 w-full text-sm appearance-none"
                                        value={newSlot.instructor} onChange={e => setNewSlot({ ...newSlot, instructor: e.target.value })}
                                    >
                                        <option value="">Select Instructor</option>
                                        {instructorsList.map((inst, i) => <option key={i} value={inst.name}>{inst.name}</option>)}
                                        <option value="TBA">To Be Announced</option>
                                    </select>
                                </div>
                                <div className="md:col-span-2">
                                    <button type="button" onClick={handleAddSlot} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm w-full transition-colors flex items-center justify-center gap-1 h-[38px]">
                                        <Plus size={16} /> Add
                                    </button>
                                </div>
                            </div>

                            <div className="bg-black/20 rounded-xl p-4 min-h-[100px] border border-white/5">
                                <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                                    Schedule for <span className="text-primary">{selectedDay}</span>
                                </h4>
                                {(!schedule.find(s => s.day === selectedDay)?.slots.length) ? (
                                    <p className="text-gray-500 text-sm italic">No classes scheduled for this day.</p>
                                ) : (
                                    <div className="space-y-2">
                                        {schedule.find(s => s.day === selectedDay)?.slots.map((slot: any, idx: number) => (
                                            <div key={idx} className="flex justify-between items-center bg-white/5 p-3 rounded-lg border border-white/5">
                                                <div className="flex items-center gap-4">
                                                    <div className="flex items-center gap-2 text-primary font-mono text-sm">
                                                        <Clock size={14} /> {slot.time}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-white text-sm">{slot.subject}</p>
                                                        <p className="text-xs text-gray-400">{slot.instructor}</p>
                                                    </div>
                                                </div>
                                                <button type="button" onClick={() => handleRemoveSlot(selectedDay, idx)} className="text-red-400 hover:bg-red-500/10 p-2 rounded-full transition-colors">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 transition-all transform hover:scale-[1.01]">
                            {loading ? "Processing..." : (editingId ? "Update Course" : "Create Course")}
                        </button>
                    </form >
                </div >
            )
            }

            {/* Search and Filters */}
            <div className="mb-6 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                <input
                    type="text"
                    placeholder="Search courses by title or teacher..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-card border border-white/10 rounded-xl pl-12 pr-4 py-3 focus:ring-2 focus:ring-primary outline-none transition-all"
                />
            </div>

            {/* Courses List */}
            <div className="grid grid-cols-1 gap-4">
                {filteredCourses.length === 0 && !loading && (
                    <div className="text-center py-20 bg-card/50 rounded-2xl border border-white/5 border-dashed">
                        <BookOpen size={48} className="mx-auto text-gray-600 mb-4" />
                        <h3 className="text-xl font-medium text-gray-400">No courses found</h3>
                        <p className="text-gray-500">Get started by creating a new course.</p>
                    </div>
                )}
                {filteredCourses.map(course => (
                    <div key={course._id} className="group bg-card hover:bg-card/80 border border-white/10 p-5 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-4 transition-all hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20">
                        <div className="flex items-center gap-5 w-full md:w-auto">
                            <div className="relative w-24 h-24 flex-shrink-0">
                                <img src={course.thumbnail} className="w-full h-full rounded-xl object-cover shadow-md" />
                                {course.isFeatured && (
                                    <div className="absolute -top-2 -right-2 bg-yellow-500 text-black text-[10px] font-bold px-2 py-1 rounded-full shadow-lg z-10">
                                        FEATURED
                                    </div>
                                )}
                            </div>
                            <div>
                                <h3 className="text-xl font-bold flex items-center gap-2 text-white group-hover:text-primary transition-colors">
                                    {course.title}
                                </h3>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    <span className="text-xs bg-white/5 text-gray-300 px-2 py-1 rounded-md border border-white/5">{course.teacherName}</span>
                                    <span className="text-xs bg-green-500/10 text-green-400 px-2 py-1 rounded-md border border-green-500/20">₹{course.price}</span>
                                    {course.originalPrice && <span className="text-xs bg-red-500/10 text-red-400 px-2 py-1 rounded-md border border-red-500/20 line-through">₹{course.originalPrice}</span>}
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-3 w-full md:w-auto justify-end">
                            <button
                                onClick={() => handleToggleFeatured(course)}
                                title={course.isFeatured ? "Remove from Home" : "Feature on Home"}
                                className={`p-3 rounded-lg hover:bg-white/10 transition-colors ${course.isFeatured ? 'bg-yellow-500/10 text-yellow-400' : 'text-gray-500 hover:text-white'}`}
                            >
                                <Eye size={20} />
                            </button>
                            <button
                                onClick={() => handleViewBuyers(course._id, course.title)}
                                className="px-4 py-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 text-sm flex items-center gap-2 border border-blue-500/20 transition-all"
                            >
                                <Users size={18} /> Buyers
                            </button>
                            <button
                                onClick={() => handleEdit(course)}
                                className="px-4 py-2 bg-green-500/10 text-green-400 rounded-lg hover:bg-green-500/20 text-sm flex items-center gap-2 border border-green-500/20 transition-all"
                            >
                                <Edit size={18} /> Edit
                            </button>
                            <button onClick={() => handleDelete(course._id)} className="p-3 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors border border-transparent hover:border-red-500/20"><Trash2 size={20} /></button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Buyers Modal */}
            {
                buyersModal.isOpen && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                        <div className="bg-card w-full max-w-2xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                            <div className="p-6 border-b border-white/10 flex justify-between items-center">
                                <h3 className="text-xl font-bold">Buyers for: <span className="text-primary">{buyersModal.courseName}</span></h3>
                                <button onClick={() => setBuyersModal({ ...buyersModal, isOpen: false })} className="text-gray-400 hover:text-white p-2 hover:bg-white/10 rounded-full transition-colors">
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="p-6 max-h-[60vh] overflow-y-auto">
                                {loadingBuyers ? (
                                    <div className="flex justify-center py-10">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                                    </div>
                                ) : buyersModal.buyers.length === 0 ? (
                                    <p className="text-center text-gray-500 py-10">No buyers yet.</p>
                                ) : (
                                    <div className="space-y-4">
                                        {buyersModal.buyers.map((buyer, idx) => (
                                            <div key={idx} className="bg-secondary/30 p-4 rounded-xl flex items-center gap-4 border border-white/5">
                                                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                                                    {buyer.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-bold">{buyer.name}</p>
                                                    <p className="text-sm text-gray-400">{buyer.email}</p>
                                                    <p className="text-xs text-gray-500 mt-1">Purchased on: {new Date(buyer.date || Date.now()).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="p-4 border-t border-white/10 bg-secondary/20 text-right">
                                <button
                                    onClick={() => setBuyersModal({ ...buyersModal, isOpen: false })}
                                    className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm font-medium transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
}


