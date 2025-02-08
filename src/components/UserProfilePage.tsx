"use client"

import React, { useState, useEffect } from 'react';
import { 
  onAuthStateChanged, 
  User as FirebaseUser 
} from '@firebase/auth';
import { auth } from '../../lib/firebase';
import Profile from './Profile';

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

export function UserProfilePage({ onClose }: { onClose: () => void }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUser(currentUser);
      
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
          setUser(user);
          
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
        } else {
          onClose();
        }
      });
  
      return () => unsubscribe();
    }
  }, []);

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-[#0f1012] z-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <div>
      <Profile profile={profile} />
    </div>
  );
}