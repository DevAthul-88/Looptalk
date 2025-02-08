"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  collection,
  query,
  orderBy,
  getDocs,
  onSnapshot,
  limit,
  addDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  writeBatch,
  setDoc,
  getDoc,
} from '@firebase/firestore';
import {
  Smile,
  Send,
  Trash2,
  Image as ImageIcon,
  Trash,
  MessageCircle,
  Loader2
} from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger
} from '@/components/ui/dialog';
import {
  ref,
  uploadBytes,
  getDownloadURL
} from '@firebase/storage';
import { db, storage } from '../../lib/firebase';
import { useChannelStore } from '../../stores/channelStore';
import { useAuth } from '@/app/contexts/AuthContext';
import { toast } from 'sonner';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Message {
  id: string;
  user: string;
  avatar: string;
  content: string;
  timestamp: any;
  userId: string;
  imageUrl?: string;
}


const createConversation = async (currentUserId: string, recipientId: string) => {
  try {
    const conversationId =
      currentUserId < recipientId
        ? `${currentUserId}_${recipientId}`
        : `${recipientId}_${currentUserId}`;

    const conversationRef = doc(db, "conversations", conversationId);
    const conversationSnap = await getDoc(conversationRef);

    // If conversation already exists, return its ID
    if (conversationSnap.exists()) {
      return conversationId;
    }

    // Create conversation if it doesn't exist
    await setDoc(conversationRef, {
      participants: [currentUserId, recipientId],
      createdAt: serverTimestamp(),
      lastMessage: null
    });

    return conversationId;
  } catch (error) {
    console.error("Error creating conversation:", error);
    toast.error("Could not start conversation");
    return null;
  }
};
const ChatArea: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const { channelId, channelName, serverId, serverOwner } = useChannelStore();
  const { currentUser } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [loadingConversation, setLoadingConversation] = useState(false);


  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const fetchMessages = useCallback(async () => {
    if (!serverId || !channelId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const messagesRef = collection(db, 'servers', serverId, 'channels', channelId, 'messages');
      const messagesQuery = query(
        messagesRef,
        orderBy('timestamp', 'desc'),
        limit(50)
      );

      const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
        const fetchedMessages = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Message)).reverse();

        setMessages(fetchedMessages);
        setLoading(false);
      }, (error) => {
        console.error('Error fetching messages:', error);
        toast.error('Failed to load messages');
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (error) {
      console.error('Error in message fetch:', error);
      toast.error('Failed to load messages');
      setLoading(false);
    }
  }, [serverId, channelId]);

  useEffect(() => {
    const cleanup = fetchMessages();
    return () => {
      cleanup && cleanup.then(fn => fn && fn());
    };
  }, [fetchMessages, channelId]);

  const uploadImage = async () => {
    if (!imageFile || !currentUser) return null;

    try {
      const storageRef = ref(storage, `chat-images/${serverId}/${channelId}/${Date.now()}_${imageFile.name}`);
      const snapshot = await uploadBytes(storageRef, imageFile);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Could not upload image');
      return null;
    }
  };

  const sendMessage = async () => {
    if ((!message.trim() && !imageFile) || !currentUser) return;

    try {
      const imageUrl = imageFile ? await uploadImage() : null;

      const messagesRef = collection(db, 'servers', serverId, 'channels', channelId, 'messages');
      await addDoc(messagesRef, {
        content: message,
        userId: currentUser.uid,
        timestamp: serverTimestamp(),
        user: currentUser.displayName || 'Anonymous',
        avatar: currentUser.photoURL || 'https://api.dicebear.com/9.x/lorelei/png?flip=true',
        ...(imageUrl && { imageUrl })
      });

      setMessage('');
      setImageFile(null);
      setShowEmojiPicker(false);
      if (imageInputRef.current) imageInputRef.current.value = '';
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
  };

  const deleteMessage = async (messageId: string) => {
    try {
      const messageRef = doc(db, 'servers', serverId, 'channels', channelId, 'messages', messageId);
      await deleteDoc(messageRef);
      toast.success('Message deleted');
    } catch (error) {
      console.error('Error deleting message:', error);
      toast.error('Failed to delete message');
    }
  };

  const deleteChannel = async () => {
    if (!currentUser || currentUser.uid !== serverOwner) return;

    try {
      const messagesRef = collection(db, 'servers', serverId, 'channels', channelId, 'messages');
      const snapshot = await getDocs(messagesRef);

      const batch = writeBatch(db);
      snapshot.docs.forEach((doc) => batch.delete(doc.ref));

      await batch.commit();

      const channelRef = doc(db, 'servers', serverId, 'channels', channelId);
      await deleteDoc(channelRef);

      toast.success('Channel Deleted');
    } catch (error) {
      console.error('Error deleting channel:', error);
      toast.error('Could not delete channel');
    }
  };

  const handleEmojiSelect = (emojiData: any) => {
    setMessage(prev => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  if (loading) {
    return (
      <div className="flex flex-col h-full p-4">
        {[1, 2, 3, 4, 5].map((_, index) => (
          <div key={index} className="mb-4">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }



  const renderServerContent = () => {
    return (
      <div className="flex flex-col items-center justify-center h-[300px] text-gray-400">
        <p className="text-lg font-semibold">You're not a member of this server</p>
        <Button
          className="mt-4 bg-rose-500 hover:bg-rose-600 transition-colors"

        >
          Join Server
        </Button>
      </div>
    );
  }


  const handleSendMessage = async (recipientId: string) => {
    if (!currentUser) {
      toast.error("Please log in to start a conversation");
      return;
    }

    setLoadingConversation(true);
    try {
      const conversationId = await createConversation(currentUser.uid, recipientId);
      router.push(`/app/inbox/${conversationId}`);
      setLoadingConversation(false);
    } catch (error) {
      console.error("Error starting conversation:", error);
      toast.error("Could not start conversation");
      setLoadingConversation(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#36393f] relative">
       



      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-300 py-8">
            No messages in this channel yet
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className="flex items-start space-x-4 hover:bg-[#2e3035] p-2 rounded-md group relative"
            >
              <img
                src={msg.avatar}
                alt={msg.user}
                className="h-10 w-10 rounded-full object-cover"
              />

              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <HoverCard>
                    <HoverCardTrigger>
                      <span className="font-semibold text-white hover:underline cursor-pointer">
                        {msg.user}
                      </span>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80 bg-[#2e3035] text-white border-1 border-white">
                      <div className="flex space-x-4">
                        <img
                          src={msg.avatar}
                          alt={msg.user}
                          className="h-16 w-16 rounded-full object-cover"
                        />
                        <div>
                          <h4 className="text-lg font-semibold">{msg.user}</h4>
                          <p className="text-sm text-gray-400 mb-2">
                            {msg.userStatus || "Active Member"}
                          </p>
                          {currentUser?.uid !== msg.userId && (
                            <div className="space-y-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-full flex items-center justify-center space-x-1 text-black"
                                onClick={() => handleSendMessage(msg.userId)}
                                disabled={loadingConversation}
                              >
                                {loadingConversation ? (
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                  <MessageCircle size={16} />
                                )}
                                <span>{loadingConversation ? 'Creating...' : 'Send Message'}</span>
                              </Button>
                              <div className="text-xs text-gray-300">
                                Last active: {msg.lastActive?.toDate()?.toLocaleString() || 'Recently'}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                  <span className="text-xs text-gray-400">
                    {msg.timestamp?.toDate()?.toLocaleString()}
                  </span>
                </div>
                {msg.content && <p className="text-gray-200">{msg.content}</p>}
                {msg.imageUrl && (
                  <img
                    src={msg.imageUrl}
                    alt="Uploaded"
                    className="max-w-xs max-h-64 mt-2 rounded-md object-cover"
                  />
                )}
              </div>
              {currentUser?.uid === msg.userId && (
                <button
                  onClick={() => deleteMessage(msg.id)}
                  className="absolute right-2 top-2 text-rose-500 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-[#40444b] flex items-center space-x-2">
        <div className="flex-1 relative">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder={`Message #${channelName}`}
            className="w-full bg-[#2e3035] text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-2 text-gray-400">
            <button onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
              <Smile size={20} />
            </button>
            {showEmojiPicker && (
              <div className="absolute bottom-full right-0 z-50">
                <EmojiPicker
                  onEmojiClick={handleEmojiSelect}
                  theme="dark"
                />
              </div>
            )}
          </div>
        </div>
        <button
          onClick={sendMessage}
          className="text-blue-500 hover:text-blue-400 disabled:text-gray-500"
          disabled={!message.trim() && !imageFile}
        >
          <Send size={24} />
        </button>
      </div>

    </div>
  );
};

export default ChatArea;