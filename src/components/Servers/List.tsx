"use client";

import React, { useState, useEffect } from "react";
import { Search, Users, Star, GamepadIcon, BookOpen, Code, Film, Music, Trophy, Briefcase, Palette, Sparkles } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/app/contexts/AuthContext";
import { collection, getDocs, doc, updateDoc, arrayUnion } from "@firebase/firestore";
import { db } from "../../../lib/firebase";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const PatternBackground = ({ name, category, seed }) => {
  const colors = {
    gaming: ["#FF6B6B", "#845EC2"],
    education: ["#4D8076", "#2C73D2"],
    technology: ["#008F7A", "#4B4453"],
    entertainment: ["#FFC75F", "#FF9671"],
    music: ["#845EC2", "#D65DB1"],
    sports: ["#2C73D2", "#0089BA"],
    business: ["#4B4453", "#B0A8B9"],
    art: ["#C34A36", "#FF8066"]
  }[category] || ["#4B4453", "#B0A8B9"];

  const generatePoints = () => {
    const points = [];
    for (let i = 0; i < 50; i++) {
      const x = Math.floor(((seed * (i + 1)) % 100) / 100 * 100);
      const y = Math.floor(((seed * (i + 2)) % 100) / 100 * 100);
      points.push({ x, y });
    }
    return points;
  };

  return (
    <div className="relative w-full h-full overflow-hidden">
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full"
      >
        <defs>
          <linearGradient id={`gradient-${seed}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colors[0]} />
            <stop offset="100%" stopColor={colors[1]} />
          </linearGradient>
          <pattern id={`pattern-${seed}`} width="10" height="10" patternUnits="userSpaceOnUse">
            <circle cx="5" cy="5" r="1" fill="rgba(255,255,255,0.1)" />
          </pattern>
        </defs>
        <rect width="100" height="100" fill={`url(#gradient-${seed})`} />
        <rect width="100" height="100" fill={`url(#pattern-${seed})`} />
        {generatePoints().map((point, i) => (
          <circle
            key={i}
            cx={point.x}
            cy={point.y}
            r="0.5"
            fill="rgba(255,255,255,0.2)"
          />
        ))}
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <h2 className="text-white text-2xl font-bold tracking-tight px-4 py-2 bg-black/30 rounded-lg backdrop-blur-sm">
          {name}
        </h2>
      </div>
    </div>
  );
};

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

const ServerList = () => {
  const [servers, setServers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const { currentUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchServers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "servers"));
        const serverList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setServers(serverList);
      } catch (error) {
        toast.error("Failed to load servers");
      } finally {
        setLoading(false);
      }
    };

    fetchServers();
  }, []);

  const handleJoinServer = async (serverId) => {
    if (!currentUser) {
      toast.error("Please sign in to join servers");
      return;
    }

    try {
      const serverRef = doc(db, "servers", serverId);
      await updateDoc(serverRef, {
        members: arrayUnion(currentUser.uid),
      });

      setServers(prev =>
        prev.map(server =>
          server.id === serverId
            ? { ...server, members: [...server.members, currentUser.uid] }
            : server
        )
      );

      toast.success("Successfully joined the server!");
      router.push(`/app/server/${serverId}`);
    } catch (error) {
      toast.error("Failed to join server");
    }
  };

  const filteredServers = servers.filter(server => {
    const matchesSearch = server.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory ? server.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br bg-[#2f3136] to-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search and Categories */}
        <div className="mb-8 space-y-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search servers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-12 pl-12 pr-4 rounded-xl bg-[#202225] border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-200"
            />
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>

          <div className="flex gap-3 flex-wrap overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
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
                  <span className="whitespace-nowrap">{category.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Server Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-[280px] rounded-xl bg-gray-800/50" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServers.map(server => (
              <div
                key={server.id}
                className="group relative bg-[#202225] rounded-xl overflow-hidden border border-gray-700/50 hover:border-rose-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-rose-500/10"
              >
                <div className="h-48">
                  {server.imageUrl ? (
                    <img
                      src={server.imageUrl}
                      alt={server.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <PatternBackground
                      name={server.name}
                      category={server.category}
                      seed={server.id.split('').reduce((a, b) => a + b.charCodeAt(0), 0)}
                    />
                  )}
                </div>

                <div className="px-4 py-4">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs px-3 py-1 bg-gray-700/50 rounded-full text-gray-300 flex items-center capitalize">
                      {(() => {
                        const CategoryIcon = categories.find(cat => cat.id === server.category)?.icon || Users;
                        return (
                          <>
                            <CategoryIcon className="w-3 h-3 mr-1.5" />
                            {server.category || "Community"}
                          </>
                        );
                      })()}
                    </span>
                    {server.featured && (
                      <div className="bg-yellow-500/90 rounded-full p-1.5">
                        <Sparkles className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-400 text-sm">
                      <Users className="w-4 h-4 mr-1.5" />
                      {server.members?.length.toLocaleString() || 0} members
                    </div>
                    {currentUser && server.members?.includes(currentUser.uid) ? (
                      <Button
                        variant="outline"
                        disabled
                        className="bg-gray-700/50 text-gray-400 border-gray-600 hover:bg-gray-700/50"
                      >
                        Joined
                      </Button>
                    ) : (
                      <Button
                        onClick={() => handleJoinServer(server.id)}
                        className="bg-rose-500 hover:bg-rose-600 text-white border-none"
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
  );
};

export default ServerList;