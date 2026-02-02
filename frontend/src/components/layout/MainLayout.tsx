"use client";

import { useState } from "react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import Sidebar from "@/components/shared/Sidebar";
import FloatingChat from "@/components/shared/FloatingChat"; // Added import
import { cn } from "@/lib/utils";
import { CartProvider } from "@/context/CartContext";

import { usePathname } from "next/navigation";

import { GoogleOAuthProvider } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import { NotificationProvider } from "@/context/NotificationContext";
import { useEffect } from "react";

export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Default to collapsed (icons only)
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    const showFooter = pathname === "/";

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem("token");
            setIsAuthenticated(!!token);

            // Protected Routes Logic
            const protectedPrefixes = ["/courses", "/dashboard", "/profile", "/meeting"];
            const isProtected = protectedPrefixes.some(prefix => pathname.startsWith(prefix));

            if (isProtected && !token) {
                router.push("/login");
            } else {
                setIsLoading(false);
            }
        };

        checkAuth();
        window.addEventListener("user-updated", checkAuth);

        return () => window.removeEventListener("user-updated", checkAuth);
    }, [pathname, router]);

    // Prevent flashing of protected content by returning null while loading
    // Since we handle this in useEffect now, we start with null (isLoading=true)
    // ensuring Server and Client match on first render.
    const protectedPrefixes = ["/courses", "/dashboard", "/profile", "/meeting"];
    const isProtected = protectedPrefixes.some(prefix => pathname.startsWith(prefix));

    if (isProtected && isLoading) {
        return <div className="min-h-screen flex items-center justify-center bg-background text-white">Loading...</div>;
    }

    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    console.log("Google Client ID:", clientId);

    return (
        <GoogleOAuthProvider clientId={clientId || ""}>
            <CartProvider>
                <NotificationProvider>
                    <div className="min-h-screen bg-background flex flex-col">
                        <Navbar />

                        <div className="flex flex-1 pt-16">

                            {isAuthenticated && (
                                <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
                            )}

                            <main
                                className={cn(
                                    "flex-1 transition-all duration-300 w-full",
                                    isAuthenticated
                                        ? (isSidebarOpen ? "md:ml-64" : "md:ml-16")
                                        : "ml-0"
                                )}
                            >
                                {children}
                                {showFooter && (
                                    <div id="contact">
                                        <Footer />
                                    </div>
                                )}
                            </main>
                        </div>
                        <FloatingChat />
                    </div>
                </NotificationProvider>
            </CartProvider>
        </GoogleOAuthProvider>
    );
}
