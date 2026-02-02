"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2, ArrowLeft, Video, Mic, Share, MessageSquare } from "lucide-react";

export default function MeetingPage() {
    const searchParams = useSearchParams();
    const router = useRouter();

    // Zoom credentials from URL
    const meetingId = searchParams.get("meetingId");
    const pwd = searchParams.get("pwd");
    const courseId = searchParams.get("courseId");

    const [isJoining, setIsJoining] = useState(true);

    useEffect(() => {
        // Simulate "Joining" process
        const timer = setTimeout(() => {
            setIsJoining(false);
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    const handleJoinNative = () => {
        // Attempt to launch Zoom native app
        if (!meetingId) return;
        const zoomUrl = `zoommtg://zoom.us/join?action=join&confno=${meetingId}&pwd=${pwd || ""}`;
        window.location.href = zoomUrl;
    };

    const handleJoinWeb = () => {
        // Web Client URL
        // Note: Embedding this in iframe often gets blocked by Zoom's X-Frame-Options unless using SDK.
        // We will open it in a new tab as a fallback if iframe fails, or try redirect.
        const webUrl = `https://zoom.us/wc/${meetingId}/join?pwd=${pwd || ""}`;
        window.open(webUrl, "_blank");
    };

    if (isJoining) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
                <Loader2 className="w-12 h-12 animate-spin text-blue-500 mb-4" />
                <h2 className="text-xl font-medium">Connecting to Live Class...</h2>
                <p className="text-gray-400 mt-2">Checking meeting status...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-900 flex flex-col text-white relative overflow-hidden">
            {/* Mock Header */}
            <div className="h-16 bg-zinc-800 flex items-center justify-between px-6 border-b border-zinc-700 z-10">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.back()} className="p-2 hover:bg-zinc-700 rounded-full">
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="font-bold text-lg">Live Chemistry Class</h1>
                        <p className="text-xs text-green-400 flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> Live Now
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <span className="bg-red-600 px-3 py-1 rounded text-xs font-bold uppercase tracking-wider">Recording</span>
                </div>
            </div>

            {/* Main Stage Placeholder */}
            <div className="flex-1 flex items-center justify-center relative bg-black/50">
                {/* This would be the Zoom Web SDK Component View in a real integration */}
                <div className="text-center space-y-6 max-w-md p-8 bg-zinc-800 rounded-2xl border border-zinc-700 shadow-2xl">
                    <div className="w-20 h-20 bg-blue-600 rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-blue-900/50">
                        <Video size={40} />
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold">Ready to Join?</h2>
                        <p className="text-gray-400 mb-4 mt-2">
                            Meeting ID: <span className="text-white font-mono">{meetingId}</span>
                        </p>
                    </div>

                    <div className="space-y-3">
                        <button
                            onClick={handleJoinNative}
                            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2"
                        >
                            Open Zoom App
                        </button>

                        <div className="relative flex py-2 items-center">
                            <div className="flex-grow border-t border-zinc-700"></div>
                            <span className="flex-shrink mx-4 text-gray-500 text-sm">OPTIONS</span>
                            <div className="flex-grow border-t border-zinc-700"></div>
                        </div>

                        <button
                            onClick={handleJoinWeb}
                            className="w-full bg-zinc-700 hover:bg-zinc-600 text-white font-medium py-3 px-4 rounded-xl transition-all"
                        >
                            Join in Browser
                        </button>
                    </div>

                    <p className="text-xs text-gray-500">
                        If the app doesn&apos;t open automatically, please click &quot;Join in Browser&quot;.
                    </p>
                </div>
            </div>

            {/* Mock Controls */}
            <div className="h-20 bg-zinc-900 border-t border-zinc-800 flex items-center justify-center gap-6">
                <ControlBtn icon={<Mic />} label="Mute" />
                <ControlBtn icon={<Video />} label="Stop Video" />
                <ControlBtn icon={<Share />} label="Share" />
                <ControlBtn icon={<MessageSquare />} label="Chat" />
                <button
                    onClick={() => router.push('/dashboard')}
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-bold ml-4"
                >
                    Leave
                </button>
            </div>
        </div>
    );
}

function ControlBtn({ icon, label }: { icon: any, label: string }) {
    return (
        <div className="flex flex-col items-center gap-1 group cursor-pointer opacity-50 hover:opacity-100 transition-opacity">
            <div className="p-3 bg-zinc-800 rounded-xl group-hover:bg-zinc-700 transition-colors">
                {icon}
            </div>
            <span className="text-xs text-gray-400">{label}</span>
        </div>
    )
}
