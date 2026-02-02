"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { Loader2, Search, Book, ShoppingCart, CheckCircle, Info, X, User, Check } from "lucide-react";
import { useCart } from "@/context/CartContext";

interface Module {
    _id: string;
    title: string;
    description: string;
    thumbnail: string;
    price: number;
    className: string;
    isFeatured?: boolean;
    instructor?: string;
    highlights?: string[];
}

export default function ModulesPage() {
    const [modules, setModules] = useState<Module[]>([]);
    const [selectedModule, setSelectedModule] = useState<Module | null>(null);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const { addToCart, isInCart } = useCart();

    const fetchModules = async () => {
        setLoading(true);
        try {
            // For now, assuming standard get without search params, or implement search in backend if needed
            const { data } = await axios.get("http://127.0.0.1:5000/api/modules");
            setModules(data);
        } catch (error) {
            console.error("Failed to fetch modules", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchModules();
    }, []);

    const filteredModules = modules.filter(m =>
        m.title.toLowerCase().includes(search.toLowerCase()) ||
        m.className.toLowerCase().includes(search.toLowerCase())
    );

    const handleAddToCart = (e: React.MouseEvent, module: Module) => {
        e.preventDefault();
        addToCart({
            _id: module._id,
            title: module.title,
            price: module.price,
            thumbnail: module.thumbnail,
            className: module.className,
            type: 'module'
        });
        alert("Module added to cart!");
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header & Search */}
            {/* Header Area */}
            <div className="relative mb-12 py-10 flex flex-col items-center text-center">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-pink-500/10 to-transparent rounded-3xl -z-10 blur-xl"></div>

                <div className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-wider text-purple-400 uppercase bg-purple-500/10 rounded-full border border-purple-500/20">
                    Study Resources
                </div>

                <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-4">
                    All <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">Modules</span>
                </h1>

                <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed mb-8">
                    Explore our curated collection of books and learning materials designed for your success.
                </p>

                <div className="w-full max-w-md mx-auto relative z-10">
                    <div className="relative group w-full">
                        <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                        <div className="relative bg-black rounded-xl p-1 flex items-center border border-white/10">
                            <Search className="text-gray-400 ml-3 w-5 h-5 flex-shrink-0" />
                            <input
                                type="text"
                                placeholder="Search by title or class..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full bg-transparent text-white placeholder-gray-500 border-none focus:ring-0 py-2.5 px-3 outline-none"
                            />
                        </div>
                    </div>
                </div>
            </div>

// ... (previous layout code)
            {loading ? (
                <div className="flex justify-center h-60 items-center">
                    <Loader2 className="w-10 h-10 animate-spin text-purple-500" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredModules.map((module) => (
                        <div key={module._id} className="bg-card border border-white/10 rounded-2xl overflow-hidden hover:border-purple-500/30 transition-all duration-300 group flex flex-col h-full">
                            {/* Thumbnail */}
                            <div className="relative h-56 overflow-hidden">
                                <img
                                    src={module.thumbnail}
                                    alt={module.title}
                                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-80" />
                                <div className="absolute top-4 left-4">
                                    <span className="bg-purple-600/90 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide shadow-lg shadow-purple-900/20">
                                        {module.className}
                                    </span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6 flex-1 flex flex-col">
                                <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 group-hover:text-purple-400 transition-colors">
                                    {module.title}
                                </h3>

                                <p className="text-gray-400 text-sm line-clamp-3 mb-6 flex-1">
                                    {module.description}
                                </p>

                                <div className="flex items-center justify-between pt-4 border-t border-white/10 mt-auto gap-3">
                                    <span className="text-2xl font-bold text-white">₹{module.price}</span>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setSelectedModule(module)}
                                            className="p-2 px-3 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors flex items-center gap-2"
                                            title="View Details"
                                        >
                                            <Info size={18} /> <span className="text-sm font-medium">Details</span>
                                        </button>
                                        <button
                                            onClick={(e) => handleAddToCart(e, module)}
                                            disabled={isInCart(module._id)}
                                            className={`px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-all ${isInCart(module._id)
                                                ? 'bg-green-500/20 text-green-500 cursor-default'
                                                : 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-600/20'
                                                }`}
                                        >
                                            {isInCart(module._id) ? (
                                                <>
                                                    <CheckCircle size={16} />
                                                </>
                                            ) : (
                                                <>
                                                    <ShoppingCart size={16} /> Cart
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {!loading && filteredModules.length === 0 && (
                <div className="text-center py-20">
                    <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-white/5 mb-4">
                        <Book className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">No modules found</h3>
                    <p className="text-gray-400">Try checking back later or searching for something else.</p>
                </div>
            )}

            {/* Details Modal */}
            {selectedModule && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedModule(null)}>
                    <div className="bg-[#0f0f12] border border-white/10 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative animate-in fade-in zoom-in duration-300" onClick={e => e.stopPropagation()}>

                        {/* Modal Header */}
                        <div className="relative h-56 sm:h-64">
                            <img src={selectedModule.thumbnail} alt={selectedModule.title} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f12] to-transparent" />
                            <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-transparent" />
                            <button
                                onClick={() => setSelectedModule(null)}
                                className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors backdrop-blur-md"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6 sm:p-8 -mt-16 relative z-10">
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-6 gap-4">
                                <div>
                                    <span className="inline-block px-3 py-1 mb-3 text-xs font-bold tracking-wider text-purple-400 uppercase bg-purple-500/10 rounded-full border border-purple-500/20 backdrop-blur-md">
                                        {selectedModule.className}
                                    </span>
                                    <h2 className="text-3xl font-black text-white leading-tight">{selectedModule.title}</h2>
                                </div>
                                <div className="sm:text-right">
                                    <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">₹{selectedModule.price}</div>
                                </div>
                            </div>

                            <div className="space-y-8">
                                {/* Instructor */}
                                <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-purple-500/30 transition-colors">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white shadow-lg">
                                        <User size={24} />
                                    </div>
                                    <div>
                                        <div className="text-xs text-purple-400 font-bold uppercase tracking-wider mb-0.5">Instructor</div>
                                        <div className="font-bold text-white text-lg">{selectedModule.instructor || 'Expert Faculty'}</div>
                                    </div>
                                </div>

                                {/* Description */}
                                <div>
                                    <h3 className="text-lg font-bold text-white mb-3">About this Course</h3>
                                    <p className="text-gray-300 leading-relaxed text-sm sm:text-base">{selectedModule.description}</p>
                                </div>

                                {/* Highlights */}
                                <div>
                                    <h3 className="text-lg font-bold text-white mb-4">What you'll learn</h3>
                                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {(selectedModule.highlights && selectedModule.highlights.length > 0 ? selectedModule.highlights : [
                                            "Comprehensive curriculum coverage",
                                            "Expert-curated study material",
                                            "Practice problems and solutions",
                                            "Regular assessments and feedback",
                                            "Exam-focused preparation strategies",
                                            "24/7 Doubt clearing support"
                                        ]).map((highlight, idx) => (
                                            <li key={idx} className="flex items-start gap-3 text-gray-300 text-sm">
                                                <div className="mt-1 w-5 h-5 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                                                    <Check className="w-3 h-3 text-green-500" />
                                                </div>
                                                <span>{highlight}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            <div className="mt-10 pt-6 border-t border-white/10 flex justify-end gap-4 sticky bottom-0 bg-[#0f0f12]/95 backdrop-blur py-4 -mb-4">
                                <button
                                    onClick={() => setSelectedModule(null)}
                                    className="px-6 py-3 rounded-xl font-bold text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                                >
                                    Close
                                </button>
                                <button
                                    onClick={(e) => { handleAddToCart(e as any, selectedModule); setSelectedModule(null); }}
                                    disabled={isInCart(selectedModule._id)}
                                    className={`px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-xl ${isInCart(selectedModule._id)
                                        ? 'bg-green-500/20 text-green-500 cursor-default'
                                        : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-purple-600/20 hover:shadow-purple-600/40 hover:scale-105 active:scale-95 duration-200'
                                        }`}
                                >
                                    {isInCart(selectedModule._id) ? (
                                        <>
                                            <CheckCircle size={20} /> Added to Cart
                                        </>
                                    ) : (
                                        <>
                                            <ShoppingCart size={20} /> Add to Cart
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
