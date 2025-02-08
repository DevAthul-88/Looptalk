// components/ServerSidebar.tsx
import React from 'react';
import { Compass, MessageSquare, Plus } from 'lucide-react';
import Image from 'next/image';

type Server = {
  id: number;
  name: string;
  img: string;
};

type ServerSidebarProps = {
  servers: Server[];
  onAddServer?: () => void;
};

export function ServerSidebar({ servers, onAddServer }: ServerSidebarProps) {
  return (
    <div className="fixed lg:relative w-[72px] h-full  bg-[#313338] flex flex-col items-center py-3 space-y-2 transition-transform duration-300 z-40">
      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-800 rounded-2xl flex items-center justify-center mb-4">
        <MessageSquare size={24} className="text-white" />
      </div>
      <div className="flex-1 overflow-y-auto w-full px-2">
        {servers.length > 0 ? (
          servers.map(server => (
            <div
              key={server.id}
              className="w-12 h-12 mb-2 rounded-2xl hover:rounded-xl transition-all duration-200 cursor-pointer relative group"
            >
              <Image
                src={server.img}
                alt={server.name}
                layout="fill"
                className="rounded-2xl hover:rounded-xl object-cover"
              />
              <div className="absolute left-0 w-1 bg-gradient-to-b hover:from-blue-500 hover:to-blue-800 rounded-r-full h-8 scale-0 group-hover:scale-100 -translate-x-2 top-1/2 -mt-4 transition-transform"/>
            </div>
          ))
        ) : (
          <div 
            className="w-12 h-12 rounded-2xl bg-[#1a1b1e] hover:bg-gradient-to-br hover:from-blue-500 hover:to-blue-800 flex items-center justify-center text-blue-500 hover:text-white transition-all duration-300 cursor-pointer"
            onClick={onAddServer}
          >
            <Plus size={24} />
          </div>
        )}
      </div>
      <button 
        className="w-12 h-12 rounded-2xl bg-[#1a1b1e] hover:bg-gradient-to-br hover:from-blue-500 hover:to-blue-800 flex items-center justify-center text-blue-500 hover:text-white transition-all duration-300"
        onClick={onAddServer}
      >
        <Compass size={24} />
      </button>
    </div>
  );
}