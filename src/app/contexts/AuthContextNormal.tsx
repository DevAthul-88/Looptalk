"use client";

import React, { createContext, useState, useContext, useEffect } from 'react';
import { 
  onAuthStateChanged, 
  User as FirebaseUser 
} from '@firebase/auth';
import { doc, getDoc } from '@firebase/firestore';
import { auth, db } from '../../../lib/firebase';
import { useRouter } from 'next/navigation';

interface UserData {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role?: 'member' | 'admin';
}

interface AuthContextType {
  currentUser: UserData | null;
  loading: boolean;
}

const AuthContextNormal = createContext<AuthContextType | undefined>(undefined);

export const AuthProviderNormal: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user: FirebaseUser | null) => {
      setLoading(true);
      if (user) {
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);
          
          const userData: UserData = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            role: userDoc.exists() ? (userDoc.data().role as 'member' | 'admin') : 'member',
          };

          setCurrentUser(userData);
        } catch (error) {
          console.error("Error fetching user data:", error);
          setCurrentUser(null);
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  return (
    <AuthContextNormal.Provider value={{ currentUser, loading }}>
      {children}
    </AuthContextNormal.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContextNormal);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProviderNormal");
  }
  return context;
};
