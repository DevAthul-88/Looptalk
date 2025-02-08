"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  Settings, 
  Bell, 
  Search, 
  Plus, 
  MessageSquare, 
  Users, 
  ChevronDown,
  Send
} from 'lucide-react';

function Inbox() {
  const router = useRouter();
  const params = useParams();
  const [selectedDM, setSelectedDM] = useState(params.slug || null);
  const [showUserList, setShowUserList] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [messageInput, setMessageInput] = useState('');

  const directMessages = [
    {
      id: 'sarah',
      name: 'Sarah Wilson',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      status: 'online',
      lastSeen: 'now'
    },
    {
      id: 'mike',
      name: 'Mike Johnson',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
      status: 'idle',
      lastSeen: '2h ago'
    },
    {
      id: 'emma',
      name: 'Emma Davis',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
      status: 'offline',
      lastSeen: '3h ago'
    }
  ];

  const [messages, setMessages] = useState([
    {
      id: 1,
      author: 'Sarah Wilson',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      content: 'Hi! Did you get a chance to review the latest design mockups? 🎨',
      timestamp: '2:30 PM'
    }
  ]);

  useEffect(() => {
    if (params.slug) {
      setSelectedDM(params.slug);
    }
  }, [params.slug]);

  const handleSelectUser = (userId) => {
    setSelectedDM(userId);
    router.push(`/inbox/${userId}`);
  };

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      const newMessage = {
        id: messages.length + 1,
        author: 'You',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
        content: messageInput,
        timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
      };
      setMessages([...messages, newMessage]);
      setMessageInput('');
    }
  };

  const filteroseUsers = directMessages.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedUser = directMessages.find(dm => dm.id === selectedDM);

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'idle': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-900">
      {/* Top Navigation */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between h-16 px-4">
            <div className="flex items-center space-x-4">
              <MessageSquare size={24} className="text-blue-500" />
              <h1 className="text-xl font-bold text-white">Messages</h1>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search messages"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64 bg-gray-700 text-white px-4 py-2 rounded-md pl-8 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
                <Search size={16} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              
              <div className="flex items-center space-x-3">
                {filteroseUsers.map(dm => (
                  <button
                    key={dm.id}
                    onClick={() => handleSelectUser(dm.id)}
                    className={`relative group ${selectedDM === dm.id ? 'ring-2 ring-blue-500' : ''}`}
                  >
                    <img 
                      src={dm.avatar} 
                      alt={dm.name} 
                      className="w-8 h-8 rounded-full hover:opacity-90 transition-opacity"
                    />
                    <div className={`absolute bottom-0 right-0 w-3 h-3 ${getStatusColor(dm.status)} rounded-full border-2 border-gray-800`} />
                  </button>
                ))}
              </div>

              <div className="flex items-center space-x-4 text-gray-400">
                <Bell size={20} className="hover:text-white cursor-pointer" />
                
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedUser ? (
            <>
              {/* Chat Header */}
              <div className="bg-gray-800/50 p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <img src={selectedUser.avatar} alt={selectedUser.name} className="w-10 h-10 rounded-full" />
                    <div className={`absolute bottom-0 right-0 w-3 h-3 ${getStatusColor(selectedUser.status)} rounded-full border-2 border-gray-800`} />
                  </div>
                  <div>
                    <h2 className="text-white font-semibold">{selectedUser.name}</h2>
                    <p className="text-sm text-gray-400">{selectedUser.status}</p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map(message => (
                  <div key={message.id} className="flex items-start space-x-4 hover:bg-gray-600/30 p-2 rounded-lg">
                    <img src={message.avatar} alt={message.author} className="w-10 h-10 rounded-full" />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-white">{message.author}</span>
                        <span className="text-xs text-gray-400">{message.timestamp}</span>
                      </div>
                      <p className="text-gray-200">{message.content}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="p-4 bg-gray-800">
                <div className="relative flex items-center space-x-2">
                  <Plus size={20} className="text-gray-400 cursor-pointer" />
                  <input
                    type="text"
                    placeholder={`Message ${selectedUser.name}`}
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1 bg-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                  <button 
                    onClick={handleSendMessage}
                    className="bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600"
                  >
                    <Send size={20} />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              Select a conversation to start messaging
            </div>
          )}
        </div>

 
      </div>
    </div>
  );
}

export default Inbox;