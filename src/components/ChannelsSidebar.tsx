import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'


function ChannelsSidebar({ isSidebarOpen, sidebarLinks }: any) {
    const router = usePathname()
    const location = router;

    return (
        <div>
            <div
                className={`${isSidebarOpen ? 'translate-x-16' : '-translate-x-full'
                    } lg:translate-x-0 fixed lg:static z-30 w-60 h-full bg-[#2B2D31] flex flex-col transition-transform duration-200`}
            >
                <div className="px-4 pt-4 h-12 shadow-sm relative border-b border-[#1E1F22]">
                    <h1 className="text-md font-bold">LoopTalk Chat</h1>
                </div>
                <div className="flex-1 overflow-y-auto mt-2">
                    <div className="px-2 py-4">
                        <div className="flex items-center px-2 mb-2 text-gray-400">
                            <span className="text-xs font-semibold uppercase tracking-wider">Navigation</span>
                        </div>
                        {sidebarLinks.map((link) => (
                            <Link
                                key={link.id}
                                href={link.path}
                                className={`flex items-center w-full px-3 py-2 rounded-lg hover:bg-[#35373C] group transition-colors duration-200 ${
                                    location === link.path
                                        ? 'bg-[#35373C] text-white'
                                        : 'text-gray-400'
                                }`}
                            >
                                <link.icon size={18} className="mr-2" />
                                <span className="font-medium">{link.name}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChannelsSidebar
