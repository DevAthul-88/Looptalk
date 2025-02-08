"use client"

import React, { useState } from 'react';
import { ArrowLeft, Camera } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signOut, updateProfile } from '@firebase/auth';
import { auth } from '../../lib/firebase';
import { db } from '../../lib/firebase';
import { doc, updateDoc } from '@firebase/firestore';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { useAuth } from '@/app/contexts/AuthContext';

type UserProfile = {
    id: string;
    name: string;
    email: string;
    avatar: string;
    joinDate?: string;
};

interface ProfileProps {
    profile: UserProfile;
}

function Profile({ profile }: ProfileProps) {
    const router = useRouter();
    const [displayName, setDisplayName] = useState(profile.name);
    const [loading, setLoading] = useState(false);
    const { currentUser } = useAuth();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            router.push("/login");
        } catch (error: any) {
            console.error("Error signing out:", error);
        }
    };

    const handleUpdateName = async () => {
        if (!auth.currentUser) {
            console.error("User is not authenticated.");
            return;
        }

        setLoading(true);
        try {
            await updateProfile(auth.currentUser, { displayName });

            if (!currentUser?.uid) {
                console.error("Profile ID is missing.");
                return;
            }

            await updateDoc(doc(db, "users", currentUser.uid), { name: displayName });

            toast.success('Name updated successfully!');
        } catch (error) {
            toast.error('Error updating name');
            console.error("Error updating name:", error);
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="min-h-screen bg-[#1A1A1A] text-gray-100">
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="flex items-center mb-8">
                    <button onClick={() => { router.back(); }} className="mr-4 p-2 hover:bg-[#2D2D2D] rounded-lg transition-colors">
                        <ArrowLeft size={24} />
                    </button>
                    <h1 className="text-2xl font-bold">Profile Settings</h1>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    <div className="md:col-span-1">
                        <div className="bg-[#2D2D2D] p-6 rounded-xl">
                            <div className="relative mb-6">
                                <img
                                    src={profile.avatar}
                                    alt={profile.name}
                                    className="w-32 h-32 rounded-full mx-auto object-cover"
                                />
                            </div>
                            <div className="text-center">
                                <h2 className="text-xl font-semibold mb-1">{profile.name}</h2>
                                <p className="text-gray-400 text-sm mb-3">{profile.email}</p>
                                <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-500/20 text-green-500">
                                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                                    online
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="md:col-span-2">
                        <div className="bg-[#2D2D2D] rounded-xl">
                            <div className="p-6 border-b border-gray-700">
                                <h3 className="text-lg font-semibold mb-4">Profile Information</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-1">
                                            Display Name
                                        </label>
                                        <input
                                            type="text"
                                            value={displayName}
                                            onChange={(e) => setDisplayName(e.target.value)}
                                            className="w-full bg-[#1A1A1A] rounded-lg px-4 py-2 focus:ring-2 ffocus:ring-rose-500 outline-none transition-shadow"
                                        />
                                        <Button onClick={handleUpdateName} className="mt-2 bg-rose-600 hover:bg-rose-700" disabled={loading}>
                                            {loading ? "Updating..." : "Update Name"}
                                        </Button>
                                    </div>
                                    {profile.joinDate && (
                                        <div className="pt-2">
                                            <p className="text-sm text-gray-400">
                                                Member since: {profile.joinDate}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="p-6">
                                <Button onClick={handleLogout} className="w-full bg-[#ff0000] hover:bg-[#cc0000] text-white transition-colors duration-200">
                                    Log Out
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;
