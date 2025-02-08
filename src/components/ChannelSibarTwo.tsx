import React, { useState, useEffect, useRef } from 'react';
import { Hash, MoreVertical, Edit, Trash2, Crown, Users, Plus, Loader2 } from 'lucide-react';
import UserCard from './UserCard';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  onSnapshot,
  query,
  arrayRemove,
  getDoc
} from '@firebase/firestore';
import { db } from '../../lib/firebase';
import { toast } from "sonner";
import { useAuth } from '@/app/contexts/AuthContext';
import { useRouter } from 'next/navigation';

interface Channel {
  id: string;
  name: string;
  type: 'text' | 'voice';
  createdAt: any;
}

interface ChannelSidebarProps {
  serverName: string;
  selectedChannel: string;
  setSelectedChannel: (channel: string) => void;
  mobileMenuOpen: boolean;
  server: {
    id: string;
    name: string;
    ownerId: string;
  };
}

const useChannelRealTimeSync = (serverId: string) => {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!serverId) return;

    const channelsRef = collection(db, 'servers', serverId, 'channels');
    const channelQuery = query(channelsRef);

    const unsubscribe = onSnapshot(channelQuery, (snapshot) => {
      const updatedChannels = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Channel));

      // Sort channels by creation time
      updatedChannels.sort((a, b) =>
        (a.createdAt?.seconds || 0) - (b.createdAt?.seconds || 0)
      );

      setChannels(updatedChannels);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching channels:", error);
      toast.error("Failed to sync channels");
      setLoading(false);
    });

    return () => unsubscribe();
  }, [serverId]);

  const createChannel = async (channelData: Omit<Channel, 'id' | 'createdAt'>) => {
    try {
      const channelsRef = collection(db, 'servers', serverId, 'channels');
      const newChannelRef = await addDoc(channelsRef, {
        ...channelData,
        createdAt: serverTimestamp()
      });

      toast.success(`Channel ${channelData.name} created`);
      return newChannelRef.id;
    } catch (error) {
      toast.error("Failed to create channel");
      console.error(error);
    }
  };

  const deleteChannel = async (channelId: string) => {
    try {
      const channelRef = doc(db, 'servers', serverId, 'channels', channelId);
      await deleteDoc(channelRef);
      toast.success(`Channel deleted`);
      return true;
    } catch (error) {
      toast.error("Failed to delete channel");
      console.error(error);
      return false;
    }
  };

  return {
    channels,
    loading,
    createChannel,
    deleteChannel
  };
};

const ChannelSidebar: React.FC<ChannelSidebarProps> = ({
  selectedChannel,
  setSelectedChannel,
  mobileMenuOpen,
  server,
  serverName
}) => {
  const [showServerActions, setShowServerActions] = useState(false);
  const [isCreateChannelModalOpen, setIsCreateChannelModalOpen] = useState(false);
  const [newChannelName, setNewChannelName] = useState('');
  const [newChannelType, setNewChannelType] = useState<'text' | 'voice'>('text');
  const [isDeleteServerModalOpen, setIsDeleteServerModalOpen] = useState(false);
  const [isEditServerModalOpen, setIsEditServerModalOpen] = useState(false);
  const [editedServerName, setEditedServerName] = useState(serverName);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef(null);

  const router = useRouter();


  const { currentUser } = useAuth();
  const {
    channels,
    loading,
    createChannel,
    deleteChannel
  } = useChannelRealTimeSync(server?.id);

  const isServerOwner = server?.ownerId === currentUser?.uid;

  const handleCreateChannel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isServerOwner) {
      toast.error("Only server owner can create channels");
      return;
    }

    await createChannel({
      name: newChannelName,
      type: newChannelType
    });

    setIsCreateChannelModalOpen(false);
    setNewChannelName('');
  };

  const handleDeleteChannel = async (channelId: string, channelName: string) => {
    if (!isServerOwner) {
      toast.error("Only server owner can delete channels");
      return;
    }

    if (channelName === selectedChannel) {
      const currentIndex = channels.findIndex(c => c.id === channelId);

      let nextChannel: Channel | undefined;

      nextChannel = channels[currentIndex + 1];

      if (!nextChannel && currentIndex > 0) {
        nextChannel = channels[currentIndex - 1];
      }

      if (nextChannel) {
        setSelectedChannel(nextChannel.name);
      } else {
        const defaultChannelId = await createChannel({
          name: 'general',
          type: 'text'
        });

        if (defaultChannelId) {
          setSelectedChannel('general');
        }
      }
    }

    // Now delete the channel
    const success = await deleteChannel(channelId);

    if (success) {
      toast.success(`Channel ${channelName} deleted`);
    }
  };

  const handleServerDelete = async () => {
    if (!isServerOwner) {
      toast.error("Only server owner can delete the server");
      return;
    }

    try {
      const serverRef = doc(db, 'servers', server.id);
      await deleteDoc(serverRef);
      toast.success("Server deleted successfully");
      router.push('/app/me');
    } catch (error) {
      console.error("Error deleting server:", error);
      toast.error("Failed to delete server");
    }
  };

  const handleServerSettings = () => {
    if (!isServerOwner) {
      toast.error("Only server owner can access server settings");
      return;
    }
    setIsEditServerModalOpen(true);
  };

  const handleEditServerName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isServerOwner) {
      toast.error("Only server owner can edit server name");
      return;
    }

    setIsLoading(true);
    try {
      const serverRef = doc(db, 'servers', server.id);
      await updateDoc(serverRef, { name: editedServerName });
      toast.success("Server name updated");
      setIsEditServerModalOpen(false);
      window.location.reload();
    } catch (error) {
      console.error("Error updating server name:", error);
      toast.error("Failed to update server name");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLeaveServer = async () => {
    if (isLoading) return;

    try {
      setIsLoading(true);

      // Reference to the server document
      const serverRef = doc(db, "servers", server?.id);

      // Get current server data to verify ownership
      const serverDoc = await getDoc(serverRef);
      if (!serverDoc.exists()) {
        throw new Error("Server not found");
      }

      const serverData = serverDoc.data();
      if (serverData.ownerId === currentUser?.uid) {
        throw new Error("Server owner cannot leave the server");
      }

      // Remove the user from the members array
      await updateDoc(serverRef, {
        members: arrayRemove(currentUser?.uid)
      });

      // Close dropdown and roseirect
      setShowServerActions(false);
      router.push('/app/me');

    } catch (error) {
      console.error('Error leaving server:', error);
      // Handle error (show toast notification, etc.)
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowServerActions(false);
      }
    };

    if (showServerActions) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showServerActions]);

  return (
    <div className={`
      fixed lg:relative w-60 bg-[#2B2D31] flex-shrink-0 flex flex-col
      transform transition-transform duration-300 ease-in-out z-40
      ${mobileMenuOpen ? 'translate-x-[72px] lg:translate-x-0 h-full' : '-translate-x-full lg:translate-x-0 h-full'}
    `}>
      {/* Server Header */}

      <div className="h-12 border-b border-[#1E1F22] flex items-center justify-between px-4 shadow-sm relative">
        <h2 className="font-semibold truncate">{serverName}</h2>
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowServerActions(!showServerActions);
            }}
            className="hover:bg-[#35373C] p-1 rounded shrink-0"
          >
            <MoreVertical className="w-5 h-5" />
          </button>

          {showServerActions && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-[#111214] rounded-md shadow-lg py-2 z-50">
              {isServerOwner ? (
                <>
                  <button
                    className="w-full px-3 py-2 text-left hover:bg-[#35373C] text-gray-300 flex items-center"
                    onClick={() => setIsEditServerModalOpen(true)}
                  >
                    <Crown className="w-4 h-4 mr-2" />
                    Server Settings
                  </button>
                  <div className="border-t border-[#35373C] my-1"></div>
                  <button
                    onClick={() => setIsDeleteServerModalOpen(true)}
                    className="w-full px-3 py-2 text-left hover:bg-[#35373C] text-rose-400 flex items-center"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Server
                  </button>
                </>
              ) : (
                <button
                  onClick={handleLeaveServer}
                  disabled={isLoading}
                  className="w-full px-3 py-2 text-left text-rose-400 hover:bg-[#35373C] transition disabled:opacity-50 flex items-center"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  {isLoading ? "Leaving..." : "Leave Server"}
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Channels List */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-2 py-4">
          <div className="flex items-center justify-between px-2 mb-2">
            <div className="text-xs font-semibold text-gray-400 uppercase">
              {loading ? 'Loading Channels...' : 'Text Channels'}
            </div>
            {isServerOwner && (
              <button
                onClick={() => setIsCreateChannelModalOpen(true)}
                className="hover:bg-[#35373C] p-1 rounded group"
                title="Create Channel"
              >
                <Plus className="w-4 h-4 text-gray-400 group-hover:text-gray-200" />
              </button>
            )}
          </div>

          {channels.length > 0 ? (
            channels.map((channel) => (
              <div
                key={channel.id}
                className={`group flex items-center justify-between px-2 py-1 rounded mb-1
                  hover:bg-[#35373C] ${selectedChannel === channel.name
                    ? 'bg-[#35373C] text-white'
                    : 'text-gray-400'
                  }`}
              >
                <button
                  onClick={() => setSelectedChannel({
                    id: channel.id,
                    name: channel.name
                  })}
                  className="flex items-center flex-1 min-w-0"
                >
                  <Hash className="w-5 h-5 mr-2 shrink-0" />
                  <span className="truncate">{channel.name}</span>
                </button>

                {isServerOwner && (
                  <div className="hidden group-hover:flex items-center space-x-1 shrink-0">
                    <button
                      onClick={() => handleDeleteChannel(channel.id, channel.name)}
                      className="p-1 hover:bg-[#404248] rounded text-rose-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm text-center mt-4">
              {loading ? 'Syncing channels...' : 'No channels available'}
            </p>
          )}
        </div>
      </div>


      <Dialog open={isDeleteServerModalOpen} onOpenChange={setIsDeleteServerModalOpen}>
        <DialogContent className="sm:max-w-md bg-[#313338] border-none text-gray-100">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-100">Delete Server</DialogTitle>
            <DialogDescription className=" text-gray-300">
              Are you sure you want to delete this server? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsDeleteServerModalOpen(false)}
              className="text-gray-400 hover:text-gray-100 hover:bg-[#35373C]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleServerDelete}
              className="bg-rose-500 hover:bg-rose-600 text-white"
            >
              Delete Server
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Channel Dialog */}
      <Dialog
        open={isCreateChannelModalOpen}
        onOpenChange={setIsCreateChannelModalOpen}
      >
        <DialogContent className="sm:max-w-md bg-[#313338] border-none text-gray-100">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center text-gray-100">Create Channel</DialogTitle>
            <DialogDescription className="text-center text-gray-300">
              Add a new channel to your server
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateChannel} className="space-y-4">
            <Input
              placeholder="Channel Name"
              value={newChannelName}
              onChange={(e) => setNewChannelName(e.target.value)}
              className="bg-[#1E1F22] border-none text-gray-100 placeholder:text-gray-400 focus-visible:ring-offset-0 focus-visible:ring-1 focus-visible:ring-rose-500"
              requirose
            />
            <Select
              value={newChannelType}
              onValueChange={(value: 'text' | 'voice') => setNewChannelType(value)}
            >
              <SelectTrigger className="bg-[#1E1F22] border-none text-gray-100 placeholder:text-gray-400 focus-visible:ring-offset-0 focus-visible:ring-1 focus-visible:ring-rose-500">
                <SelectValue placeholder="Channel Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">Text Channel</SelectItem>
              </SelectContent>
            </Select>
            <Button type="submit" disabled={loading} className="w-full bg-rose-500 hover:bg-rose-600 text-white transition-colors">
              {loading ? 'Creating...' : 'Create Channel'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isEditServerModalOpen}
        onOpenChange={setIsEditServerModalOpen}
      >
        <DialogContent className="sm:max-w-md bg-[#313338] border-none text-gray-100">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center text-gray-100">
              Edit Server Name
            </DialogTitle>
            <DialogDescription className="text-center text-gray-300">
              Change the name of your server
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditServerName} className="space-y-4">
            <Input
              placeholder="Server Name"
              value={editedServerName}
              onChange={(e) => setEditedServerName(e.target.value)}
              className="bg-[#1E1F22] border-none text-gray-100 placeholder:text-gray-400 focus-visible:ring-offset-0 focus-visible:ring-1 focus-visible:ring-rose-500"
              requirose
            />

            <Select
              value={newChannelType}
              onValueChange={(value: 'text' | 'voice') => setNewChannelType(value)}
            >
              <SelectTrigger className="bg-[#1E1F22] border-none text-gray-100 placeholder:text-gray-400 focus-visible:ring-offset-0 focus-visible:ring-1 focus-visible:ring-rose-500">
                <SelectValue placeholder="Channel Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">Text Channel</SelectItem>
              </SelectContent>
            </Select>

            <Button
              type="submit"
              className="w-full bg-rose-500 hover:bg-rose-600 text-white transition-colors"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </div>
              ) : (
                'Save Changes'
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <UserCard />
    </div>
  );
};

export default ChannelSidebar;