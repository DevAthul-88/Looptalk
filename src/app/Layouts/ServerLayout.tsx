import ChannelsSidebar from '@/components/ChannelsSidebar';
import ServersSidebar from '@/components/ServersSidebar'
import { Compass, HomeIcon, Menu, MessageSquare } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import React, { useState } from 'react'


function ServerLayout({ children }: any) {

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const location = usePathname();
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    const sidebarLinks = [
        { id: 1, name: 'Home', icon: HomeIcon, path: '/app/me' },
        { id: 2, name: 'Conversations', icon: MessageSquare, path: '/app/inbox' },
        { id: 3, name: 'Explore Servers', icon: Compass, path: '/app/servers' }
    ];

    return (
        <div className="flex h-screen bg-[#313338] text-gray-100 overflow-hidden">
            {/* Mobile Menu Button */}
            <button
                    className="lg:hidden fixed bottom-4 right-4 bg-[#5865F2] p-3 rounded-full shadow-lg z-50"
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                >
                    <Menu size={24} />
                </button>
            <ServersSidebar isSidebarOpen={isSidebarOpen} location={location} />

            {/* Channels Sidebar */}
            <ChannelsSidebar isSidebarOpen={isSidebarOpen} location={location} sidebarLinks={sidebarLinks} />
            {children}
        </div>
    )
}

export default ServerLayout