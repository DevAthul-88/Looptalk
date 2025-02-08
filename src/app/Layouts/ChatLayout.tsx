"use client";

import ChannelSidebarTwo from "@/components/ChannelSibarTwo";
import ServersSidebar from "@/components/ServersSidebar";
import { Home, Menu } from "lucide-react";
import { useParams, usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";
import { collection, doc, getDoc, getDocs, onSnapshot } from "@firebase/firestore";
import { auth, db } from "../../../lib/firebase";
import { Skeleton } from "@/components/ui/skeleton";
import { AuthProvider } from "../contexts/AuthContext";
import ChannelHeader from "@/components/Header/ChannelHeader";
import { useChannelStore } from "../../../stores/channelStore";
import { MemberList } from "@/components/MemberList";
import useServerStore from "../../../stores/serverStore";
import { Toaster } from "@/components/ui/sonner"
import Link from "next/link";

function ChatLayout({ children }: any) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const location = usePathname();
    const [server, setServer] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const params = useParams();
    const [notFound, setNotFound] = useState(false);
    const [isMemberListOpen, setIsMemberListOpen] = useState(true);
    const { setChannel } = useChannelStore();
    const { setServerId } = useServerStore();

    useEffect(() => {
        if (!params?.id) {
            console.error("Server ID is undefined.");
            setLoading(false);
            return;
        }

        const serverId = params.id;
        const serverRef = doc(db, "servers", serverId);
        const channelsRef = collection(db, "servers", serverId, "channels");

        // Set initial loading state
        setLoading(true);

        // Combine server and channels fetching
        const unsubscribeServer = onSnapshot(serverRef, async (serverSnap) => {
            if (serverSnap.exists()) {
                try {
                    // Fetch channels once
                    const channelsSnapshot = await getDocs(channelsRef);
                    const channels = channelsSnapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    }));

                    const selectedChannel = channels.length > 0 ? channels[0] : null;

                    // Update server state with initial data
                    setServer({
                        id: serverSnap.id,
                        ...serverSnap.data(),
                        channels,
                        selectedChannel
                    });

                    // Set initial channel if exists
                    if (selectedChannel) {
                        setChannel(serverId, selectedChannel.id, selectedChannel.name);
                    }

                    // Real-time listener for channel updates
                    const unsubscribeChannels = onSnapshot(channelsRef, (snapshot) => {
                        const updatedChannels = snapshot.docs.map(doc => ({
                            id: doc.id,
                            ...doc.data()
                        }));

                        setServer(prev => ({
                            ...prev,
                            channels: updatedChannels,
                            selectedChannel: updatedChannels[0] || prev.selectedChannel
                        }));
                    });

                    // Stop loading after initial fetch
                    setLoading(false);
                    setServerId(serverId);
                    setNotFound(false);

                    // Return cleanup function
                    return () => {
                        unsubscribeServer();
                        unsubscribeChannels();
                    };
                } catch (error) {
                    console.error("Error fetching server details:", error);
                    setServer(null);
                    setLoading(false);
                }
            } else {
                setNotFound(true);
                setServer(null);
                setLoading(false);
            }
        });

        // Return cleanup function
        return () => unsubscribeServer();
    }, [params?.id, location, setChannel]);

    const handleChannelSelect = ({ id, name }: { id: string, name: string }) => {
        if (!server?.id) return;

        setChannel(server.id, id, name);

        // Update local state
        setServer(prev => ({
            ...prev,
            selectedChannel: { id, name }
        }));
    };

    return (
        <AuthProvider>
            <Toaster />

            {notFound ? <>
                <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                    <div className="text-center space-y-6 p-8 bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center">
                                <Home className="w-8 h-8 text-gray-400" />
                            </div>

                            <h2 className="text-2xl font-bold text-gray-100">No Server Found</h2>
                            <p className="text-gray-400">Couldn't find the server you're looking for.</p>
                        </div>

                        <Link href={"/app/me"}>
                        <button
                            className="px-6 py-2 mt-4 bg-rose-500 hover:bg-rose-600 text-white rounded-md transition-colors duration-200 font-medium"
                        >
                            Return Home
                        </button>
                        </Link>
                    </div>
                </div>
            </> : <>
                <div className="flex h-screen bg-[#313338] text-gray-100">
                    {/* Mobile Menu Button */}
                    <button
                        className="lg:hidden fixed bottom-4 right-4 bg-[#5865F2] p-3 rounded-full shadow-lg z-50"
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    >
                        <Menu size={24} />
                    </button>

                    {/* Servers Sidebar */}
                    <ServersSidebar isSidebarOpen={isSidebarOpen} location={location} />

                    {/* Channel Sidebar */}
                    {loading ? (
                        <div className="flex w-64 h-full justify-center items-center">
                            <Skeleton className="w-full h-full" />
                        </div>
                    ) : server ? (
                        <ChannelSidebarTwo
                            serverName={server.name || "Unknown Server"}
                            channels={server.channels || []}
                            mobileMenuOpen={isSidebarOpen}
                            server={{
                                id: server.id,
                                name: server.name,
                                ownerId: server.ownerId
                            }}
                            selectedChannel={server.selectedChannel?.name}
                            setSelectedChannel={handleChannelSelect}
                        />
                    ) : (
                        <div className="flex w-64 h-full justify-center items-center text-gray-400">
                            Server Not Found
                        </div>
                    )}

                    {/* Main Content Area */}
                    <div className="flex flex-col flex-1">
                        {/* Channel Header */}
                        {loading ? (
                            <div className="h-12 flex items-center justify-center bg-[#2F3136]">
                                <Skeleton className="w-24 h-6" />
                            </div>
                        ) : server ? (
                            <ChannelHeader
                                selectedChannel={server?.selectedChannel?.name}
                            />
                        ) : (
                            null
                        )}

                        {/* Chat Content */}
                        <div className="flex-1 overflow-auto">
                            {loading ? null : server ? children : (
                                <div className="flex justify-center items-center h-full text-gray-400">
                                    No Content Available
                                </div>
                            )}
                        </div>
                    </div>

                    <MemberList
                        isOpen={isMemberListOpen}
                        onClose={() => setIsMemberListOpen(false)}
                    />


                </div>
            </>}

        </AuthProvider>
    );
}

export default ChatLayout;