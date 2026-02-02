"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    Home,
    LayoutDashboard,
    BookOpen,
    Library,
    Info,
    Phone,
    ChevronLeft,
    ChevronRight,
    GraduationCap,
    Users,
    CreditCard,
    MessageSquare,
    FileText,
    LogOut,
    Video
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
    isOpen: boolean;
    setIsOpen: (value: boolean) => void;
}

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
    const pathname = usePathname();
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            // eslint-disable-next-line react-hooks/exhaustive-deps
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const dashboardLink = user?.role === 'admin' ? '/admin/dashboard' : '/dashboard';

    const router = useRouter(); // Add router

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("cart"); // Optional: clear cart too
        document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
        window.dispatchEvent(new Event("user-updated"));
        router.push("/login");
    };

    const menuItems = [
        { icon: Home, label: "Home", href: "/" },
        ...(user?.role === 'admin' ? [
            { icon: LayoutDashboard, label: "Dashboard", href: dashboardLink },
            { icon: Users, label: "Users", href: "/admin/users" },
            { icon: CreditCard, label: "Payments", href: "/admin/payments" },
            { icon: MessageSquare, label: "Messages", href: "/admin/messages" }
        ] : []),
        { icon: BookOpen, label: "All Courses", href: "/courses" },
        { icon: Library, label: "My Courses", href: user?.role === 'admin' ? '/admin/dashboard' : '/dashboard' },
        // For regular users, add Messages link pointing to the dashboard tab
        ...(user?.role !== 'admin' ? [
            { icon: MessageSquare, label: "Messages", href: "/messages" }
        ] : []),
        { icon: BookOpen, label: "Modules & Books", href: "/modules" },
        { icon: Users, label: "Our Scholars", href: "/scholars" },
        { icon: Info, label: "About Us", href: "/about" },
        { icon: Phone, label: "Contact Us", href: "/contact" },
        // Add Logout to the menu list as requested ("also add logout sign")
        {
            icon: LogOut,
            label: "Logout",
            action: handleLogout,
            customClass: "text-red-400 hover:bg-red-500/10 hover:text-red-500"
        },
    ];

    return (
        <>
            <aside
                className={cn(
                    "fixed top-16 left-0 h-[calc(100vh-4rem)] bg-background border-r border-white/10 transition-all duration-300 z-40 flex flex-col",
                    isOpen ? "w-64" : "w-0 md:w-16"
                )}
            >
                <div className="flex-1 overflow-y-auto py-6">
                    <div className="space-y-2 px-3">
                        {menuItems.map((item, index) => {
                            const isActive = item.href ? pathname === item.href : false;

                            // Render Button for Actions (Logout)
                            if ((item as any).action) {
                                return (
                                    <button
                                        key={index}
                                        onClick={(item as any).action}
                                        className={cn(
                                            "w-full flex items-center gap-4 px-3 py-3 rounded-lg transition-colors group relative overflow-hidden",
                                            (item as any).customClass || "text-gray-400 hover:bg-secondary/50 hover:text-white"
                                        )}
                                        title={!isOpen ? item.label : undefined}
                                    >
                                        <item.icon className={cn("w-5 h-5 min-w-[20px]", (item as any).customClass ? "" : "text-gray-400 group-hover:text-white")} />
                                        <span className={cn(
                                            "font-medium whitespace-nowrap transition-all duration-300",
                                            isOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10 hidden md:block"
                                        )}>
                                            {item.label}
                                        </span>
                                    </button>
                                );
                            }

                            // Render Link for standard items
                            return (
                                <Link
                                    key={index}
                                    href={item.href!}
                                    className={cn(
                                        "flex items-center gap-4 px-3 py-3 rounded-lg transition-colors group relative overflow-hidden",
                                        isActive
                                            ? "bg-primary/10 text-primary"
                                            : "text-gray-400 hover:bg-secondary/50 hover:text-white"
                                    )}
                                    title={!isOpen ? item.label : undefined}
                                >
                                    <item.icon className={cn("w-5 h-5 min-w-[20px]", isActive ? "text-primary" : "text-gray-400 group-hover:text-white")} />
                                    <span className={cn(
                                        "font-medium whitespace-nowrap transition-all duration-300",
                                        isOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10 hidden md:block" // hidden on mobile if closed, block on desktop for layout
                                    )}>
                                        {item.label}
                                    </span>
                                </Link>
                            );
                        })}
                    </div>

                    {/* Study Packs Section - mimicking the provided image style */}
                    {isOpen && (
                        <div className="mt-8 px-4 opacity-100 transition-opacity duration-500">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                                Study Packs
                            </p>
                            <Link href="/courses" className="flex items-center gap-4 text-gray-400 hover:text-white group">
                                <GraduationCap className="w-5 h-5 text-purple-500" />
                                <span className="font-medium">Batches</span>
                            </Link>
                        </div>
                    )}
                </div>

                {/* Toggle Button */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="absolute -right-3 top-6 bg-primary text-white p-1 rounded-full shadow-lg border border-white/10 hover:bg-primary/90 transition-colors z-50 ring-4 ring-background"
                >
                    {isOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
                </button>
            </aside>

            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 md:hidden top-16"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </>
    );
}

