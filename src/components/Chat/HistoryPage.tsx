"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { db, auth } from "../../../lib/firebase";
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  orderBy, 
  limit,
  doc,
  getDoc
} from "@firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";
import { UserPlus } from "lucide-react";

interface UserInfo {
  uid: string;
  displayName: string;
  photoURL?: string;
  conversationId: string;
  lastMessage?: {
    content: string;
    timestamp: Date;
  };
}

export async function fetchInteractedUsersWithDetails(currentUserId: string): Promise<UserInfo[]> {
  try {
    if (!currentUserId) return [];

    const sentMessagesQuery = query(
      collection(db, "conversations"),
      where("participants", "array-contains", currentUserId)
    );

    const conversationSnapshot = await getDocs(sentMessagesQuery);

    const userPromises = conversationSnapshot.docs.map(async (conversationDoc) => {
      const participants = conversationDoc.data().participants || [];
      const otherUserId = participants.find((id: string) => id !== currentUserId);

      if (!otherUserId) return null;

      const userRef = doc(db, "users", otherUserId);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        console.warn(`User not found: ${otherUserId}`);
        return null;
      }

      const userData = userSnap.data();

      const messagesRef = collection(db, "conversations", conversationDoc.id, "messages");
      const lastMessageQuery = query(messagesRef, orderBy("createdAt", "desc"), limit(1));
      const lastMessageSnapshot = await getDocs(lastMessageQuery);

      let lastMessage = null;
      if (!lastMessageSnapshot.empty) {
        const lastMessageData = lastMessageSnapshot.docs[0].data();
        lastMessage = {
          content: lastMessageData.content,
          timestamp: lastMessageData.createdAt?.toDate()
        };
      }

      return {
        uid: otherUserId,
        displayName: userData.username || userData.displayName || 'Unknown User',
        photoURL: userData.photoURL || 'https://api.dicebear.com/9.x/lorelei/png?flip=true',
        conversationId: conversationDoc.id,
        lastMessage
      };
    });

    const users = await Promise.all(userPromises);
    return users.filter((user): user is UserInfo => user !== null);
  } catch (error) {
    console.error("Error fetching interacted users:", error);
    return [];
  }
}

const ChatList = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState<UserInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!currentUser) return;

    async function loadUsers() {
      setLoading(true);
      try {
        const userList = await fetchInteractedUsersWithDetails(currentUser.uid);
        setUsers(userList);
      } catch (error) {
        console.error("Failed to load chat users", error);
      } finally {
        setLoading(false);
      }
    }

    loadUsers();
  }, [currentUser]);

  const SkeletonLoader = () => (
    <div className="space-y-4 p-4">
      {[...Array(5)].map((_, index) => (
        <Skeleton key={index} className="h-16 w-full bg-zinc-800 rounded-md" />
      ))}
    </div>
  );

  if (!currentUser) return <SkeletonLoader />;
  if (loading) return <SkeletonLoader />;

  return (
    <div className="bg-[#2f3136] h-full overflow-y-auto">
      {users.length === 0 && (
        <div className="text-center text-gray-400 p-8 flex flex-col items-center">
          <UserPlus size={48} className="mb-4 text-gray-500" />
          <p>No conversations yet</p>
          <p className="text-sm text-gray-500">Start a new conversation</p>
        </div>
      )}

      <div className="chat-list border-b">
        {users.map((user) => (
          <Link 
            href={`/app/inbox/${user.conversationId}`} 
            key={user.uid} 
            className="flex items-center p-3 hover:bg-[#34373c] text-white transition-colors group"
          >
            <div className="relative mr-3">
              <img 
                src={user.photoURL} 
                alt={user.displayName} 
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#2f3136]"></div>
            </div>
            <div className="flex-1 overflow-hidden">
              <div className="font-semibold truncate">
                {user.displayName}
              </div>
              {user.lastMessage && (
                <div className="text-sm text-gray-400 truncate">
                  {user.lastMessage.content}
                </div>
              )}
            </div>
            {user.lastMessage && (
              <span className="text-xs text-gray-500 ml-2">
                {user.lastMessage.timestamp?.toLocaleDateString()}
              </span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ChatList;