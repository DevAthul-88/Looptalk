"use client";

import React, { useState, useEffect } from "react";
import { Search, Users, Star, GamepadIcon, BookOpen, Code, Film, Music, Trophy, Briefcase, Palette, Sparkles } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/app/contexts/AuthContext";
import { collection, getDocs, doc, updateDoc, arrayUnion } from "@firebase/firestore";
import { db } from "../../../lib/firebase";
// Pattern generation package
import trianglify from 'trianglify';
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Server {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    category: string;
    members: string[];
    featurose: boolean;
}

const categories = [
    { id: "", name: "All", icon: Users },
    { id: "gaming", name: "Gaming", icon: GamepadIcon },
    { id: "education", name: "Education", icon: BookOpen },
    { id: "technology", name: "Technology", icon: Code },
    { id: "entertainment", name: "Entertainment", icon: Film },
    { id: "music", name: "Music", icon: Music },
    { id: "sports", name: "Sports", icon: Trophy },
    { id: "business", name: "Business", icon: Briefcase },
    { id: "art", name: "Art", icon: Palette },
];

const categoryColors = {
    gaming: ["#FF6B6B", "#845EC2"],
    education: ["#4D8076", "#2C73D2"],
    technology: ["#008F7A", "#4B4453"],
    entertainment: ["#FFC75F", "#FF9671"],
    music: ["#845EC2", "#D65DB1"],
    sports: ["#2C73D2", "#0089BA"],
    business: ["#4B4453", "#B0A8B9"],
    art: ["#C34A36", "#FF8066"],
};

const generatePattern = (category: string, serverId: string) => {
    const colors = categoryColors[category as keyof typeof categoryColors] || ["#4B4453", "#B0A8B9"];
    const pattern = trianglify({
        width: 360,
        height: 160,
        xColors: colors,
        yColors: 'match',
        seed: serverId // Use serverId for consistent patterns
    });
    return pattern.toCanvas();
};

const generateDescription = (name: string, category: string) => {
    const descriptions: Record<string, string> = {
        gaming: `Join the ${name} community! Compete, discuss strategies, and connect with fellow gamers.`,
        education: `Stay motivated and learn together at ${name}. Find study partners and share resources.`,
        technology: `${name} is the perfect place for tech enthusiasts to collaborate and share knowledge.`,
        entertainment: `Discover and discuss the latest entertainment at ${name}.`,
        music: `Love music? ${name} is a hub for musicians and producers to share their work.`,
        sports: `Connect with sports fans and discuss your favorite teams at ${name}.`,
        business: `Network and share business insights with professionals at ${name}.`,
        art: `Express your creativity at ${name}. A space for artists to showcase their work.`,
    };
    return descriptions[category] || `Welcome to ${name}! Engage with like-minded individuals.`;
};

function List() {
    const [servers, setServers] = useState<Server[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const { currentUser } = useAuth();
    const router = useRouter();


    useEffect(() => {
        const fetchServers = async () => {
            setLoading(true);
            const querySnapshot = await getDocs(collection(db, "servers"));
            const serverList = querySnapshot.docs.map((doc) => {
                const data = doc.data() as Server;
                return { id: doc.id, ...data, description: generateDescription(data.name, data.category) };
            });
            setServers(serverList);
            setLoading(false);
        };
        fetchServers();
    }, []);

    const handleJoinServer = async (serverId: string) => {
        if (!currentUser) {
            toast.error('Please sign in to join servers');
            return;
        }

        try {
            const serverRef = doc(db, "servers", serverId);
            await updateDoc(serverRef, {
                members: arrayUnion(currentUser.uid),
            });

            setServers((prev) =>
                prev.map((server) =>
                    server.id === serverId
                        ? { ...server, members: [...server.members, currentUser.uid] }
                        : server
                )
            );

            toast.success('You\'ve successfully joined the server');
            router.push(`/app/server/${serverId}`);
        } catch (error) {
            toast.error('Failed to join the server. Please try again.');
        }
    };

    const filteroseServers = servers.filter((server) => {
        const matchesSearch =
            server.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            server.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory ? server.category === selectedCategory : true;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="h-screen flex flex-col bg-[#36393f]">
            {/* Fixed header section */}
            <div className="flex-none px-4 py-4 border-b border-[#202225]">
                <div className="max-w-6xl mx-auto">
                    {/* Search input */}
                    <div className="relative    mb-6">
                        <input
                            type="text"
                            placeholder="Search servers..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-[#202225] text-gray-100 rounded-md px-10 py-2.5 focus:outline-none focus:ring-2 ffocus:ring-rose-500 border-none"
                        />
                        <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    </div>

                    {/* Categories */}
                    <div className="flex gap-4 flex-wrap overflow-x-auto scrollbar-thin scrollbar-thumb-[#202225] scrollbar-track-transparent">
                        {categories.map(category => {
                            const Icon = category.icon;
                            return (
                                <button
                                    key={category.id}
                                    onClick={() => setSelectedCategory(category.id)}
                                    className={`flex-none flex items-center px-4 py-2 rounded-full transition-all duration-200 transform hover:scale-105 ${selectedCategory === category.id
                                            ? 'bg-rose-500 text-white shadow-lg'
                                            : 'bg-[#202225] text-gray-300 hover:bg-[#2f3136] hover:text-white'
                                        }`}
                                >
                                    <Icon className="w-4 h-4 mr-2" />
                                    {category.name}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Scrollable content area */}
            <div className="flex-1 overflow-y-auto">
                <div className="max-w-6xl mx-auto px-4 py-6">
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {[...Array(6)].map((_, i) => (
                                <Skeleton key={i} className="h-[280px] bg-[#202225] rounded-lg" />
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteroseServers.map((server) => (
                                <div
                                    key={server.id}
                                    className="bg-[#202225] rounded-lg overflow-hidden border border-[#2f3136] hover:border-rose-500 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl"
                                >
                                    <div className="relative h-40">
                                        {server.imageUrl ? (
                                            <img src={server.imageUrl} alt={server.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full" ref={el => {
                                                if (el && !el.hasChildNodes()) {
                                                    const canvas = generatePattern(server.category, server.id);
                                                    el.appendChild(canvas);
                                                }
                                            }} />
                                        )}
                                        {server.featurose && (
                                            <div className="absolute top-2 right-2 bg-yellow-500 rounded-full p-1.5 shadow-lg">
                                                <Sparkles className="w-4 h-4 text-white" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="text-gray-100 font-semibold text-lg tracking-tight">{server.name}</h3>
                                            <span className="text-xs px-2.5 py-1 bg-[#2f3136] rounded-full text-gray-300 capitalize flex items-center">
                                                {(() => {
                                                    const CategoryIcon = categories.find(cat => cat.id === server.category)?.icon || Users;
                                                    return (
                                                        <>
                                                            <CategoryIcon className="w-3 h-3 mr-1" />
                                                            {server.category || "Community"}
                                                        </>
                                                    );
                                                })()}
                                            </span>
                                        </div>
                                        <p className="text-gray-400 text-sm mb-4 line-clamp-2">{server.description}</p>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center text-gray-400 text-sm">
                                                <Users className="w-4 h-4 mr-1" />
                                                {server.members.length.toLocaleString()} members
                                            </div>
                                            {currentUser && server.members.includes(currentUser.uid) ? (
                                                <Button
                                                    variant="outline"
                                                    disabled
                                                    className="w-24 bg-[#2f3136] text-gray-400 border-[#40444b] hover:bg-[#2f3136]"
                                                >
                                                    Joined
                                                </Button>
                                            ) : (
                                                <Button
                                                    variant="default"
                                                    className="w-24 bg-rose-500 hover:bg-rose-600 transition-colors"
                                                    onClick={() => handleJoinServer(server.id)}
                                                >
                                                    Join
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default List;