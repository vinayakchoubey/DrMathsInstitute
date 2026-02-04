"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { Menu, X, User, LogOut, ShoppingBag, ChevronDown, ShoppingCart, Bell } from "lucide-react";
import { useNotifications } from "@/context/NotificationContext";
import { useRouter } from "next/navigation";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [user, setUser] = useState<any>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [showNotifications, setShowNotifications] = useState(false);
    const { notifications, unreadCount, markAsRead } = useNotifications();
    const router = useRouter();
    const notificationRef = useRef<HTMLDivElement>(null);
    const { items: cartItems } = useCart();

    useEffect(() => {
        const loadUser = () => {
            // ... existing logic ...
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
        };

        loadUser();
        window.addEventListener("user-updated", loadUser);

        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setProfileOpen(false);
            }
            if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
                setShowNotifications(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            window.removeEventListener("user-updated", loadUser);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setUser(null);
        window.location.href = "/login";
    };

    return (
        <nav className="fixed w-full z-50 bg-background/80 backdrop-blur-md border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                            Dr Maths
                        </Link>
                    </div>
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-center space-x-6">

                            {/* Notification Bell */}
                            {user && (
                                <div className="relative" ref={notificationRef}>
                                    <button
                                        onClick={() => setShowNotifications(!showNotifications)}
                                        className="relative p-2 hover:bg-white/5 rounded-full transition-colors mr-2 text-gray-300 hover:text-white"
                                    >
                                        <Bell size={24} />
                                        {unreadCount > 0 && (
                                            <span className="absolute top-0 right-0 bg-blue-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full animate-pulse">
                                                {unreadCount}
                                            </span>
                                        )}
                                    </button>

                                    {showNotifications && (
                                        <div className="absolute right-0 mt-2 w-80 bg-card border border-white/10 rounded-xl shadow-2xl py-2 animate-in fade-in zoom-in-95 duration-200 overflow-hidden z-50">
                                            <div className="px-4 py-2 border-b border-white/10 flex justify-between items-center">
                                                <h3 className="font-bold text-sm text-white">Notifications</h3>
                                            </div>
                                            <div className="max-h-80 overflow-y-auto custom-scrollbar">
                                                {notifications.length === 0 ? (
                                                    <div className="px-4 py-8 text-center text-gray-500 text-sm">
                                                        No new notifications
                                                    </div>
                                                ) : (
                                                    notifications.map((notif: any) => (
                                                        <div
                                                            key={notif._id}
                                                            onClick={async () => {
                                                                if (!notif.isRead) await markAsRead(notif._id);
                                                                if (notif.link) {
                                                                    router.push(notif.link);
                                                                    setShowNotifications(false);
                                                                }
                                                            }}
                                                            className={`px-4 py-3 hover:bg-white/5 transition-colors cursor-pointer border-b border-white/5 last:border-0 ${!notif.isRead ? 'bg-blue-500/5' : ''}`}
                                                        >
                                                            <div className="flex gap-3">
                                                                <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${!notif.isRead ? 'bg-blue-500' : 'bg-transparent'}`} />
                                                                <div>
                                                                    <p className={`text-sm ${!notif.isRead ? 'text-white font-medium' : 'text-gray-400'}`}>
                                                                        {notif.message}
                                                                    </p>
                                                                    <p className="text-xs text-gray-600 mt-1">
                                                                        {new Date(notif.createdAt).toLocaleDateString()}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Cart Icon */}
                            {user && (
                                <Link href="/cart" className="relative p-2 hover:bg-white/5 rounded-full transition-colors mr-2">
                                    <ShoppingCart size={24} className="text-gray-300" />
                                    {cartItems.length > 0 && (
                                        <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                                            {cartItems.length}
                                        </span>
                                    )}
                                </Link>
                            )}

                            {user ? (
                                <div className="relative" ref={dropdownRef}>
                                    <button
                                        onClick={() => setProfileOpen(!profileOpen)}
                                        className="flex items-center gap-3 hover:bg-secondary/50 p-2 rounded-lg transition-all"
                                    >
                                        <span className="font-bold text-sm">Hi, {user.name}</span>
                                        {user.profileImage ? (
                                            <img
                                                src={user.profileImage}
                                                alt={user.name}
                                                className="w-8 h-8 rounded-full object-cover ring-2 ring-white/10"
                                            />
                                        ) : (
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-xs ring-2 ring-white/10">
                                                {user.name.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                        <ChevronDown size={16} className={`transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    {profileOpen && (
                                        <div className="absolute right-0 mt-2 w-56 bg-card border border-white/10 rounded-xl shadow-2xl py-2 animate-in fade-in zoom-in-95 duration-200">
                                            <Link
                                                href="/profile"
                                                className="flex items-center gap-3 px-4 py-3 hover:bg-secondary/50 transition-colors text-sm"
                                                onClick={() => setProfileOpen(false)}
                                            >
                                                <User size={18} className="text-blue-400" />
                                                <span>My Profile</span>
                                            </Link>
                                            <Link
                                                href={user.role === 'admin' ? '/admin/dashboard' : '/dashboard'}
                                                className="flex items-center gap-3 px-4 py-3 hover:bg-secondary/50 transition-colors text-sm"
                                                onClick={() => setProfileOpen(false)}
                                            >
                                                <ShoppingBag size={18} className="text-purple-400" />
                                                <span>My Purchases</span>
                                            </Link>
                                            <div className="h-px bg-white/10 my-1" />
                                            <button
                                                onClick={handleLogout}
                                                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-500/10 hover:text-red-400 transition-colors text-sm text-left"
                                            >
                                                <LogOut size={18} />
                                                <span>Logout</span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="flex items-center gap-4">
                                    <Link href="/login" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-5 py-2 rounded-full text-sm font-bold shadow-lg hover:shadow-blue-500/25 transition-all duration-300 transform hover:-translate-y-0.5">
                                        Login
                                    </Link>

                                </div>
                            )}
                        </div>
                    </div>
                    <div className="-mr-2 flex md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
                        >
                            {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isOpen && (
                <div className="md:hidden bg-background border-b border-border">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {user ? (
                            <div className="border-t border-white/10 mt-2 pt-2">
                                <div className="px-3 py-2 flex items-center gap-3 mb-2">
                                    {user.profileImage ? (
                                        <img src={user.profileImage} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-xs">
                                            {user.name.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                    <span className="font-bold">{user.name}</span>
                                </div>
                                <Link
                                    href="/profile"
                                    className="flex items-center gap-3 px-3 py-2 rounded-md text-base font-medium hover:bg-accent"
                                >
                                    <User size={18} /> My Profile
                                </Link>
                                <Link
                                    href="/dashboard"
                                    className="flex items-center gap-3 px-3 py-2 rounded-md text-base font-medium hover:bg-accent"
                                >
                                    <ShoppingBag size={18} /> My Purchases
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 text-left px-3 py-2 rounded-md text-base font-medium text-red-500 hover:bg-red-500/10"
                                >
                                    <LogOut size={18} /> Logout
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-4 mt-4 px-2">
                                <Link href="/login" className="block text-center px-4 py-3 rounded-xl text-base font-semibold bg-secondary/50 hover:bg-secondary/80 text-white transition-all border border-white/5">
                                    Login
                                </Link>

                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}

