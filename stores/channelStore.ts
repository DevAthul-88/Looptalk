import { create } from 'zustand';

interface ChannelState {
  channelId: string | null;
  channelName: string | null;
  serverId: string | null;
  setChannel: (serverId: string, channelId: string, channelName: string) => void;
  resetChannel: () => void;
}

export const useChannelStore = create<ChannelState>((set) => ({
  channelId: null,
  channelName: null,
  serverId: null,
  
  setChannel: (serverId, channelId, channelName) => set(() => ({
    serverId,
    channelId,
    channelName
  })),
  
  resetChannel: () => set(() => ({
    serverId: null,
    channelId: null,
    channelName: null
  }))
}));