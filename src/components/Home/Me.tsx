"use client";

import React from "react";
import { MessageSquare, User } from "lucide-react";
import Link from "next/link";
import MainLayout from "@/app/Layouts/MainLayout";
import ChannelHeader from "../Header/ChannelHeader";

function Home() {
  return (
    <MainLayout>
      <ChannelHeader selectedChannel="Home" />
      <div className="flex-1 overflow-y-auto pt-14 pb-8 bg-[#1E1F22] text-white">
        <div className="px-4 py-12 md:px-8">
          <div className="max-w-5xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-16">
              <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-rose-400 via-rose-500 to-pink-500 text-transparent bg-clip-text leading-tight">
                Welcome to LoopTalk Chat
              </h1>
              <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mt-4">
                Experience the next generation of team communication. Fast,
                secure, and beautifully designed.
              </p>
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-2 gap-8">
              <Link
                href="/app/servers"
                className="group relative overflow-hidden p-6 md:p-8 bg-[#2D2D2D] rounded-2xl hover:bg-[#3D3D3D] transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <div className="relative z-10">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-xl bg-rose-500/20 flex items-center justify-center mr-4">
                      <MessageSquare size={24} className="text-rose-400" />
                    </div>
                    <h2 className="text-2xl font-semibold">Start Chatting</h2>
                  </div>
                  <p className="text-gray-400">
                    Jump into conversations with your team in real-time
                  </p>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-rose-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>

              <Link
                href="/app/profile"
                className="group relative overflow-hidden p-6 md:p-8 bg-[#2D2D2D] rounded-2xl hover:bg-[#3D3D3D] transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <div className="relative z-10">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center mr-4">
                      <User size={24} className="text-purple-400" />
                    </div>
                    <h2 className="text-2xl font-semibold">Your Profile</h2>
                  </div>
                  <p className="text-gray-400">
                    Customize your profile and manage your settings
                  </p>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default Home;
