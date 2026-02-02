"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Plus, Trash2, Save, Loader2, Building, User } from "lucide-react";

export default function ManageAboutPage() {
    const [aboutData, setAboutData] = useState({ instituteOverview: "", ceoProfile: "", ceoImage: "" });
    const [ceoImageFile, setCeoImageFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);


    // Member State
    const [members, setMembers] = useState([]);
    const [showMemberForm, setShowMemberForm] = useState(false);
    const [editingMember, setEditingMember] = useState<any>(null);
    const [memberForm, setMemberForm] = useState({ name: "", role: "", bio: "", image: "" });
    const [memberImageFile, setMemberImageFile] = useState<File | null>(null);

    useEffect(() => {
        fetchAbout();
        fetchMembers();
    }, []);

    const fetchAbout = async () => {
        try {
            const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000"}/api/about`);
            if (data && data.instituteOverview) setAboutData(data);
        } catch (e) { console.error(e); }
    };

    const fetchMembers = async () => {
        try {
            const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000"}/api/about/members`);
            setMembers(data);
        } catch (e) { console.error("Failed to fetch members", e); }
    };

    const handleUpload = async (file: File) => {
        const formData = new FormData();
        formData.append("file", file);
        try {
            const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000"}/api/upload`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            return data.url;
        } catch (e) {
            console.error("Upload failed", e);
            return null;
        }
    };

    const handleSaveAbout = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const config = { headers: { Authorization: `Bearer ${token}` } };

            let imageUrl = aboutData.ceoImage;
            if (ceoImageFile) {
                imageUrl = await handleUpload(ceoImageFile);
            }

            await axios.put(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000"}/api/about`, { ...aboutData, ceoImage: imageUrl }, config);
            alert("About section updated!");
        } catch (e) {
            console.error(e);
            alert("Failed to update About section");
        } finally {
            setLoading(false);
        }
    };

    const handleSaveMember = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const config = { headers: { Authorization: `Bearer ${token}` } };

            let imageUrl = memberForm.image;
            if (memberImageFile) {
                const uploadedUrl = await handleUpload(memberImageFile);
                if (uploadedUrl) imageUrl = uploadedUrl;
            }

            const payload = { ...memberForm, image: imageUrl };

            if (editingMember) {
                await axios.put(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000"}/api/about/members/${editingMember._id}`, payload, config);
                alert("Member updated successfully");
            } else {
                await axios.post(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000"}/api/about/members`, payload, config);
                alert("Member added successfully");
            }

            setShowMemberForm(false);
            setMemberForm({ name: "", role: "", bio: "", image: "" });
            setMemberImageFile(null);
            setEditingMember(null);
            fetchMembers();

        } catch (e) {
            console.error(e);
            alert("Failed to save member");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteMember = async (id: string) => {
        if (!confirm("Delete this team member?")) return;
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000"}/api/about/members/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchMembers();
        } catch (e) {
            console.error("Failed to delete member", e);
            alert("Failed to delete member");
        }
    };

    const handleEditMember = (member: any) => {
        setEditingMember(member);
        setMemberForm({
            name: member.name,
            role: member.role,
            bio: member.bio,
            image: member.image
        });
        setMemberImageFile(null);
        setShowMemberForm(true);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative">
            <div className="mb-8">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
                    Manage About Us
                </h1>
                <p className="text-gray-400 mt-2">Update institute overview and CEO profile information</p>
            </div>

            <div className="bg-card border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10 transform translate-x-1/2 -translate-y-1/2"></div>

                <div className="flex justify-between items-center mb-8 pb-6 border-b border-white/10">
                    <h2 className="text-2xl font-bold text-white">
                        {!aboutData.instituteOverview ? "Initialize About Section" : "Edit About Content"}
                    </h2>
                    {aboutData.instituteOverview && (
                        <button
                            onClick={async () => {
                                if (confirm("Are you sure you want to delete the About section?")) {
                                    try {
                                        const token = localStorage.getItem("token");
                                        await axios.delete(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000"}/api/about`, {
                                            headers: { Authorization: `Bearer ${token}` }
                                        });
                                        setAboutData({ instituteOverview: "", ceoProfile: "", ceoImage: "" });
                                        alert("About section deleted");
                                    } catch (e) { alert("Failed to delete"); }
                                }
                            }}
                            className="bg-red-500/10 text-red-500 hover:bg-red-500/20 px-4 py-2 rounded-xl flex items-center gap-2 transition-colors text-sm font-medium border border-red-500/20"
                        >
                            <Trash2 size={18} /> Delete Section
                        </button>
                    )}
                </div>

                {!aboutData.instituteOverview && (
                    <div className="bg-blue-500/10 border border-blue-500/20 text-blue-200 p-6 rounded-2xl mb-8 flex items-start gap-4">
                        <div className="bg-blue-500 rounded-full p-1 text-white mt-1">
                            <Plus size={16} />
                        </div>
                        <div>
                            <h4 className="font-bold mb-1">Get Started</h4>
                            <p className="text-sm opacity-80">The About section is currently empty. Use the form below to populate the "About Us" page on your website.</p>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSaveAbout} className="space-y-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Institute Overview */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 mb-2 text-primary">
                                <Building size={20} />
                                <label className="font-semibold text-white">Institute Overview</label>
                            </div>
                            <textarea
                                className="bg-secondary/30 border border-white/10 rounded-2xl px-6 py-4 w-full h-64 focus:ring-2 focus:ring-primary focus:bg-secondary/50 outline-none transition-all leading-relaxed custom-scrollbar"
                                value={aboutData.instituteOverview}
                                onChange={e => setAboutData({ ...aboutData, instituteOverview: e.target.value })}
                                required
                                placeholder="Describe your institute's mission, history, and values..."
                            />
                        </div>

                        {/* CEO Profile */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 mb-2 text-primary">
                                <User size={20} />
                                <label className="font-semibold text-white">CEO / Founder Profile</label>
                            </div>
                            <textarea
                                className="bg-secondary/30 border border-white/10 rounded-2xl px-6 py-4 w-full h-64 focus:ring-2 focus:ring-primary focus:bg-secondary/50 outline-none transition-all leading-relaxed custom-scrollbar"
                                value={aboutData.ceoProfile}
                                onChange={e => setAboutData({ ...aboutData, ceoProfile: e.target.value })}
                                required
                                placeholder="Write about the founder..."
                            />
                        </div>
                    </div>

                    {/* CEO Image */}
                    <div className="bg-secondary/20 p-6 rounded-2xl border border-white/5">
                        <label className="block font-semibold text-white mb-4">CEO / Founder Image</label>
                        <div className="flex flex-col md:flex-row items-center gap-6">
                            <div className="relative w-32 h-32 bg-black/40 rounded-full overflow-hidden flex-shrink-0 border-2 border-primary/30 shadow-lg">
                                {aboutData.ceoImage ? (
                                    <img src={aboutData.ceoImage} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="flex items-center justify-center w-full h-full text-gray-500">
                                        <User size={32} />
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 w-full">
                                <input
                                    type="file"
                                    onChange={e => setCeoImageFile(e.target.files?.[0] || null)}
                                    className="block w-full text-sm text-gray-400 file:mr-4 file:py-2.5 file:px-6 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90 transition-all cursor-pointer bg-black/20 rounded-full border border-white/10"
                                />
                                <p className="text-xs text-gray-500 mt-2 ml-2">Recommended: Square image, max 2MB.</p>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-white/10 flex justify-end">
                        <button type="submit" disabled={loading} className="w-full md:w-auto bg-primary hover:bg-primary/90 text-white font-bold py-3 px-10 rounded-xl shadow-lg shadow-primary/20 flex justify-center items-center gap-2 transform transition-all active:scale-95">
                            {loading ? <Loader2 className="animate-spin" /> : (aboutData.instituteOverview ? <><Save size={18} /> Save Changes</> : <><Plus size={18} /> Create About Section</>)}
                        </button>
                    </div>
                </form>

                {/* --- Team Members Management Section --- */}
                <div className="mt-16 pt-10 border-t border-white/10">
                    <div className="flex justify-between items-end mb-8">
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-2">Team Members</h2>
                            <p className="text-gray-400">Manage the faculty and team members displayed on the About page.</p>
                        </div>
                        <button
                            onClick={() => {
                                setEditingMember(null);
                                setMemberForm({ name: "", role: "", bio: "", image: "" });
                                setMemberImageFile(null);
                                setShowMemberForm(true);
                            }}
                            className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all font-bold shadow-lg shadow-primary/20"
                        >
                            <Plus size={18} /> Add Member
                        </button>
                    </div>

                    {/* Member Form Modal/Area */}
                    {showMemberForm && (
                        <div className="bg-secondary/20 border border-white/10 rounded-2xl p-6 mb-8 animate-in fade-in slide-in-from-top-4">
                            <h3 className="text-xl font-bold text-white mb-6">
                                {editingMember ? "Edit Team Member" : "Add New Team Member"}
                            </h3>
                            <form onSubmit={handleSaveMember} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="font-semibold text-white text-sm">Name</label>
                                        <input
                                            type="text"
                                            className="bg-black/20 border border-white/10 rounded-xl px-4 py-3 w-full outline-none focus:border-primary/50 text-white"
                                            value={memberForm.name}
                                            onChange={e => setMemberForm({ ...memberForm, name: e.target.value })}
                                            required
                                            placeholder="e.g. Dr. Sarah Smith"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="font-semibold text-white text-sm">Role / Position</label>
                                        <input
                                            type="text"
                                            className="bg-black/20 border border-white/10 rounded-xl px-4 py-3 w-full outline-none focus:border-primary/50 text-white"
                                            value={memberForm.role}
                                            onChange={e => setMemberForm({ ...memberForm, role: e.target.value })}
                                            required
                                            placeholder="e.g. Senior Math Faculty"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="font-semibold text-white text-sm">Bio</label>
                                    <textarea
                                        className="bg-black/20 border border-white/10 rounded-xl px-4 py-3 w-full h-32 outline-none focus:border-primary/50 text-white resize-none"
                                        value={memberForm.bio}
                                        onChange={e => setMemberForm({ ...memberForm, bio: e.target.value })}
                                        required
                                        placeholder="Short biography..."
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="font-semibold text-white text-sm">Profile Image</label>
                                    <div className="flex gap-4 items-center">
                                        {memberForm.image && (
                                            <img src={memberForm.image} alt="Preview" className="w-16 h-16 rounded-full object-cover border border-white/10" />
                                        )}
                                        <input
                                            type="file"
                                            onChange={e => setMemberImageFile(e.target.files?.[0] || null)}
                                            className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90 cursor-pointer"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                                    <button
                                        type="button"
                                        onClick={() => setShowMemberForm(false)}
                                        className="px-5 py-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="bg-primary hover:bg-primary/90 text-white px-8 py-2.5 rounded-xl font-bold shadow-lg shadow-primary/20 flex items-center gap-2"
                                    >
                                        {loading ? <Loader2 className="animate-spin w-4 h-4" /> : <Save size={18} />}
                                        {editingMember ? "Update Member" : "Add Member"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Members List */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {members.map((member: any) => (
                            <div key={member._id} className="bg-secondary/10 border border-white/5 rounded-2xl p-5 flex gap-5 items-center hover:border-white/20 transition-colors group">
                                <img
                                    src={member.image || "/placeholder-user.jpg"}
                                    alt={member.name}
                                    className="w-20 h-20 rounded-full object-cover border-2 border-primary/20"
                                />
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-white text-lg truncate">{member.name}</h3>
                                    <p className="text-primary text-sm font-medium truncate mb-1">{member.role}</p>
                                    <p className="text-gray-400 text-xs line-clamp-2">{member.bio}</p>
                                </div>
                                <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => handleEditMember(member)}
                                        className="p-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 transition-colors"
                                        title="Edit"
                                    >
                                        <User size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteMember(member._id)}
                                        className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                        {members.length === 0 && !showMemberForm && (
                            <div className="col-span-full py-10 text-center text-gray-400 bg-white/5 rounded-2xl border border-dashed border-white/10">
                                No team members added yet. Click &quot;Add Member&quot; to get started.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

