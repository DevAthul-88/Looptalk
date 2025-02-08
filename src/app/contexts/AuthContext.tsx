// contexts/AuthContext.tsx
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

const AuthContext = createContext<AuthContextType>({ 
  currentUser: null, 
  loading: true 
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user: FirebaseUser | null) => {
      if (user) {
        try {
          // Fetch additional user data from Firestore
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);
          
          const userData: UserData = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            ...userDoc.data()
          };

          setCurrentUser(userData);
        } catch (error) {
          router.push('/login');
          console.error('Error fetching user data:', error);
        }
      } else {
        router.push('/login');
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using auth context
export const useAuth = () => useContext(AuthContext);