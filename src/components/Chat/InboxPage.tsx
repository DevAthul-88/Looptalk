"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { Send, Smile, Trash2 } from "lucide-react";
import {
  collection,
  query,
  addDoc,
  serverTimestamp,
  onSnapshot,
  orderBy,
  doc,
  getDoc,
  setDoc,
  deleteDoc
} from "@firebase/firestore";
import { db, auth } from "../../../lib/firebase";
import EmojiPicker from 'emoji-picker-react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@radix-ui/react-hover-card";
import ChannelHeader from "../Header/ChannelHeader";

function PrivateMessagePage() {
  const pathname = usePathname();
  const conversationId = pathname.split('/').pop(); // Extract conversation ID from path
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [recipientUser, setRecipientUser] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!currentUser || !conversationId) return;

    const fetchConversation = async () => {
      try {
        setLoading(true);
        const conversationRef = doc(db, "conversations", conversationId);
        const conversationSnap = await getDoc(conversationRef);

        if (!conversationSnap.exists()) {
          console.error("Conversation not found");
          router.push('/404');
          return;
        }

        // Extract participant IDs from conversation
        const participants = conversationSnap.data().participants;
        const otherParticipantId = participants.find(id => id !== currentUser.uid);

        // Fetch recipient user details
        const recipientRef = doc(db, "users", otherParticipantId);
        const recipientSnap = await getDoc(recipientRef);

        if (recipientSnap.exists()) {
          setRecipientUser(recipientSnap.data());
        }

        // Fetch messages for this conversation
        const messagesRef = collection(db, "conversations", conversationId, "messages");
        const q = query(messagesRef, orderBy("createdAt", "asc"));

        const unsubscribeMessages = onSnapshot(q, (snapshot) => {
          const fetchedMessages = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
          }));
          setMessages(fetchedMessages);
          messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        });
        setLoading(false);
        return () => unsubscribeMessages();
      } catch (error) {
        setLoading(false);
        console.error("Error fetching conversation:", error);
      }
    };

    fetchConversation();
  }, [currentUser, conversationId]);

  const sendMessage = async () => {
    if (!messageInput.trim() || !currentUser) return;

    try {
      const messagesRef = collection(db, "conversations", conversationId, "messages");
      await addDoc(messagesRef, {
        content: messageInput,
        senderId: currentUser.uid,
        createdAt: serverTimestamp(),
        read: false,
        user: currentUser.displayName,
        avatar: currentUser.photoURL,
        timestamp: serverTimestamp()
      });

      await setDoc(doc(db, "conversations", conversationId), {
        lastMessage: {
          content: messageInput,
          senderId: currentUser.uid,
          createdAt: serverTimestamp()
        }
      }, { merge: true });

      setMessageInput("");
      setShowEmojiPicker(false);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const deleteMessage = async (messageId) => {
    if (!currentUser) return;

    try {
      const messageRef = doc(db, "conversations", conversationId, "messages", messageId);
      await deleteDoc(messageRef);
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  const handleEmojiSelect = (emojiData) => {
    setMessageInput(prev => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  return (
    <>
      <ChannelHeader
        selectedChannel={`Message to: ${recipientUser?.username || ''}`}
      />
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-300 py-8">
            No messages
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className="flex items-start space-x-4 hover:bg-[#2e3035] p-2 rounded-md group relative"
            >
              <img
                src={msg.avatar ? msg.avatar : "https://api.dicebear.com/9.x/lorelei/png?flip=true"}
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

                    <HoverCardContent className="w-80 bg-[#2e3035] text-white border border-gray-700 rounded-lg shadow-lg p-5">
                      <div className="flex items-center space-x-4">
                        {/* Avatar */}
                        <img
                          src={msg.avatar}
                          alt={msg.user}
                          className="h-16 w-16 rounded-full object-cover border-2 border-gray-500 shadow-md"
                        />

                        {/* User Info */}
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold">{msg.user}</h4>
                          <p className="text-sm text-gray-400 mb-2">
                            {msg.userStatus || "Active Member"}
                          </p>

                          {/* If user is not the current user, show action buttons */}
                          {currentUser?.uid !== msg.userId && (
                            <div className="space-y-3">
                              {/* Send Message Button */}

                              {/* Last Active Status */}
                              <div className="text-xs text-gray-400">
                                Last active: {msg.lastActive?.toDate()?.toLocaleString() || "Recently"}
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
              {currentUser?.uid === msg.senderId && (
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
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder={`Message ${recipientUser?.displayName || ''}`}
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
          disabled={!messageInput.trim()}
        >
          <Send size={24} />
        </button>
      </div>
    </>
  );
}

export default PrivateMessagePage;