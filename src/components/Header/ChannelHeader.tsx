"use client";

import { Hash, HelpCircle, User } from 'lucide-react'
import Link from 'next/link';
import React from 'react'

function ChannelHeader({ selectedChannel }: string) {
  return (
    <div>
      {/* Channel Header */}
      <div className="h-12 border-b border-[#1E1F22] flex items-center justify-between px-4 shadow-sm">
        <div className="flex items-center">
          <Hash className="w-5 h-5 text-gray-400 mr-2" />
          <h2 className="font-semibold">{selectedChannel}</h2>
        </div>

        <div className="flex items-center space-x-2">

          <Link href={"/app/profile"}>
          <button className="w-8 h-8 flex items-center justify-center hover:bg-[#35373C] rounded">
            <User className="w-5 h-5 text-gray-400" />
          </button>
          </Link>


          {/* Help */}
          <button className="w-8 h-8 flex items-center justify-center hover:bg-[#35373C] rounded">
            <HelpCircle className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChannelHeader