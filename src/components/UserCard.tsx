import { Settings } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { doc, getDoc } from '@firebase/firestore';
import { db, auth } from '../../lib/firebase';
import { Skeleton } from './ui/skeleton';
import Link from 'next/link';
import { useAuth } from '@/app/contexts/AuthContext';
import { onAuthStateChanged } from '@firebase/auth';

// Extended User Profile Type
type UserProfile = {
  name: string;
  email: string;
  avatar: string;
  title?: string;
  bio?: string;
  location?: string;
  joinDate?: string;
  badges?: string[];
  links?: {
    github?: string;
    twitter?: string;
    website?: string;
  };
};

function UserCard() {
  const [currentUser, setCurrentUser] = useState({});
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) {
      return text;
    }
    return text.slice(0, maxLength) + '...';
  };

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setCurrentUser(currentUser);
      
      // Create profile directly from auth.currentUser
      const profile: UserProfile = {
        name: currentUser.displayName || 'Anonymous',
        email: currentUser.email || '',
        avatar: currentUser.photoURL || 'https://api.dicebear.com/9.x/lorelei/png?flip=true',
        title: 'User',
        bio: 'No bio available',
        location: 'Unknown',
        joinDate: currentUser.metadata.creationTime || 'Recently',
        badges: ['User'],
        links: {}
      };

      setProfile(profile);
      setIsLoading(false);
    } else {
      // Fallback to onAuthStateChanged if currentUser is null
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          setCurrentUser(user);
          
          const profile: UserProfile = {
            name: user.displayName || 'Anonymous',
            email: user.email || '',
            avatar: user.photoURL || 'https://api.dicebear.com/9.x/lorelei/png?flip=true',
            title: 'User',
            bio: 'No bio available',
            location: 'Unknown',
            joinDate: user.metadata.creationTime || 'Recently',
            badges: ['User'],
            links: {}
          };

          setProfile(profile);
          setIsLoading(false);
        }
      });
  
      return () => unsubscribe();
    }
  }, []);

  if (isLoading) {
    return (
      <div className="h-14 bg-[#232428] px-3 flex items-center">
        <Skeleton className="w-8 h-8 rounded-full bg-gray-300" />
        <div className="ml-2 min-w-0">
          <Skeleton className="h-4 w-24 bg-gray-300 mb-1" />
          <Skeleton className="h-3 w-16 bg-gray-300" />
        </div>
        <Skeleton className="w-8 h-8 rounded-full bg-gray-300" />
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <div>
      <div className="h-14 bg-[#232428] px-3 flex items-center">
        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-[#5865F2] flex items-center justify-center shrink-0">
          <img
            src={profile.avatar}
            alt={`${profile.name}'s Avatar`}
            className="w-full h-full rounded-full object-cover"
          />
        </div>
        <div className="ml-2 min-w-0">
          <div className="text-sm font-medium truncate">{profile.name}</div>
          <div className="text-xs text-gray-400">{truncateText(profile.email, 20)}</div>
        </div>
        <Link href={"/app/profile"}>
          <button className="w-8 h-8 flex items-center justify-center hover:bg-[#35373C] rounded shrink-0">
            <Settings className="w-5 h-5" />
          </button>
        </Link>
      </div>
    </div>
  );
}

export default UserCard;
