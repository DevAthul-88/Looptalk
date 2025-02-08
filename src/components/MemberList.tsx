import { X, UserMinus } from 'lucide-react';
import Image from 'next/image';
import { useAuth } from '@/app/contexts/AuthContext';
import useServerStore from '../../stores/serverStore';
import { useState } from 'react';
import { doc, updateDoc, arrayRemove } from '@firebase/firestore';
import { db } from '../../lib/firebase';

type MemberStatus = 'online' | 'idle' | 'dnd' | 'offline';

type Member = {
  id: string;
  name: string;
  avatar: string;
  status: MemberStatus;
};

type MemberListProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function MemberList({ isOpen, onClose }: MemberListProps) {
  const { selectedServer } = useServerStore();
  const { currentUser } = useAuth();
  const [kickingUserId, setKickingUserId] = useState<string | null>(null);

  if (!selectedServer) return null;

  const isOwner = currentUser?.uid === selectedServer.ownerId;
  // Sort members: show the owner first
  const sortedMembers = selectedServer.members.sort((a: Member, b: Member) =>
    a.id === selectedServer.ownerId ? -1 : b.id === selectedServer.ownerId ? 1 : 0
  );

  const handleKickMember = async (memberId: string) => {
    if (!isOwner || memberId === selectedServer.ownerId) return;
    
    try {
      setKickingUserId(memberId);
      
      const serverRef = doc(db, 'servers', selectedServer.id);
      
      // Remove member from the members array
      await updateDoc(serverRef, {
        members: arrayRemove(memberId)
      });
      
      // Update local state if needed through your server store
      // This depends on how you're managing state in useServerStore
      
    } catch (error) {
      console.error('Error kicking member:', error);
    } finally {
      setKickingUserId(null);
    }
  };

  // Discord-like status color mapping
  const getStatusColor = (status: MemberStatus) => {
    switch (status) {
      case 'online': return 'bg-[#3BA55D]';
      case 'idle': return 'bg-[#FAA81A]';
      case 'dnd': return 'bg-[#ED4245]';
      default: return 'bg-[#747F8D]';
    }
  };

  return (
    <div
      className={`fixed lg:relative top-0 right-0 w-[240px] h-full bg-[#2B2D31] border-l border-[#202225] 
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}`}
    >
      <div className="h-12 bg-[#2B2D31] border-b border-[#202225] flex items-center justify-between px-4">
        <h2 className="font-semibold text-white">Members — {selectedServer.members.length}</h2>
        <button
          onClick={onClose}
          className="lg:hidden text-[#B9BBBE] hover:text-white"
        >
          <X size={20} />
        </button>
      </div>
      <div className="p-4 space-y-2 overflow-y-auto h-[calc(100%-3rem)]">
        {sortedMembers.map(member => (
          <div
            key={member.id}
            className="group flex items-center gap-3 p-2 rounded-lg hover:bg-[#393C43] transition-colors cursor-pointer"
          >
            <div className="relative">
              <Image
                src={member.avatar || 'https://api.dicebear.com/9.x/lorelei/png?flip=true'}
                alt={member.name}
                width={32}
                height={32}
                className="rounded-full"
              />
              <div
                className={`absolute bottom-0 right-0 w-3 h-3 ${getStatusColor('online')} rounded-full border-2 border-[#2F3136]`}
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-white">{member.name}</div>
              {member.id === selectedServer.ownerId ? (
                <span className="text-xs text-[#FAA81A] font-semibold">Owner</span>
              ) : (
                <span className="text-xs text-[#5478dd] font-semibold">Member</span>
              )}
            </div>
            {isOwner && member.id !== currentUser?.uid && (
              <button
                onClick={() => handleKickMember(member.id)}
                disabled={kickingUserId === member.id}
                className={`opacity-0 group-hover:opacity-100 ml-2 p-1 rounded hover:bg-[#ED4245] 
                  transition-all duration-200 ${kickingUserId === member.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                title="Kick member"
              >
                <UserMinus size={16} className="text-white" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default MemberList;