import { ChannelSidebar } from "@/components/ChannelSidebar";
import { MemberList } from "@/components/MemberList";
import { ServerSidebar } from "@/components/ServerSidebar";
import { UserProfilePage } from "@/components/UserProfilePage";
import { useState } from "react";


// Mock Data (would typically come from API or context)
const servers = [
  { id: 1, name: 'Gaming Hub', img: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=64&h=64&fit=crop' },
  { id: 2, name: 'React Community', img: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=64&h=64&fit=crop' },
  { id: 3, name: 'Design Inspiration', img: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=64&h=64&fit=crop' },
];

const channels = [
  { id: 1, name: 'general', type: 'text' },
  { id: 2, name: 'announcements', type: 'text' },
  { id: 3, name: 'voice-chat', type: 'voice' },
  { id: 4, name: 'resources', type: 'text' },
];

const currentUser = {
  name: 'John Doe',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=48&h=48&fit=crop',
  status: 'online',
};

export default function page() {
  const [selectedChannel, setSelectedChannel] = useState(channels[0]);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [showMembers, setShowMembers] = useState(false);

  const handleAddServer = () => {
    // Implement server creation logic
    console.log('Add new server');
  };

  return (
    <div className="flex h-screen bg-[#0f1012] text-blue-100">
      {showUserProfile && (
        <UserProfilePage onClose={() => setShowUserProfile(false)} />
      )}

      <ServerSidebar
        servers={servers} 
        onAddServer={handleAddServer}
      />

      <ChannelSidebar 
        channels={channels}
        currentUser={currentUser}
        selectedChannel={selectedChannel}
        onChannelSelect={setSelectedChannel}
        onShowUserProfile={() => setShowUserProfile(true)}
      />

      {/* Placeholder for main chat area */}
      <div className="flex-1 bg-[#1a1b1e] flex items-center justify-center">
        <h1 className="text-2xl">
          Select a channel to start chatting
        </h1>
      </div>

      {/* Optional: Mobile-friendly member list */}
      <MemberList
        isOpen={showMembers} 
        onClose={() => setShowMembers(false)} 
      />
    </div>
  );
}