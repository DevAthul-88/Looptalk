import { create } from 'zustand'
import { doc, getDoc } from '@firebase/firestore'
import { db } from '../lib/firebase'

interface Member {
  id: string;
  name: string;
  email: string;
  avatar: string;
  status: 'online' | 'offline' | 'idle';
  role: 'owner' | 'admin' | 'member';
}

interface Server {
  id: string;
  name: string;
  members: Member[];
  ownerId: string;
  createdAt: Date;
}

const useServerStore = create((set, get) => ({
  selectedServer: null as Server | null,
  serverId: null as string | null,

  setServerId: (id: string) => {
    set({ serverId: id });
    get().fetchServerDetails(id);
  },

  fetchServerDetails: async (serverId: string) => {
    if (!serverId) return;
  
    try {
      const serverRef = doc(db, 'servers', serverId);
      const serverSnap = await getDoc(serverRef);
  
      if (!serverSnap.exists()) {
        set({ selectedServer: null });
        return;
      }
  
      const serverData = serverSnap.data() as { members: string[], name: string, ownerId: string, createdAt?: any };
      
      // Log the members array to ensure it's populated
      console.log('Members:', serverData.members);
  
      const memberDetails = await get().fetchMemberDetails(serverData.members);
  
      // Log the fetched member details for debugging
      console.log('Fetched member details:', memberDetails);
  
      const createdAt = serverData.createdAt instanceof Date ? serverData.createdAt : (serverData.createdAt?.toDate ? serverData.createdAt.toDate() : new Date());
  
      set({
        selectedServer: {
          id: serverId,
          name: serverData.name,
          members: memberDetails,
          ownerId: serverData.ownerId,
          createdAt
        }
      });
    } catch (error) {
      console.error('Error fetching server details:', error);
      set({ selectedServer: null });
    }
  },
  
  fetchMemberDetails: async (memberIds: string[]) => {
    if (!memberIds?.length) return [];
  
    try {
      const userDetailsPromises = memberIds.map(async (memberId) => {
        const userRef = doc(db, 'users', memberId);
        const userSnap = await getDoc(userRef);
  
        if (!userSnap.exists()) return null;
  
        const userData = userSnap.data();
        return {
          id: memberId,
          name: userData?.displayName || userData?.username || userData?.email?.split('@')[0] || '',
          avatar: userData?.photoURL || '',
          email: userData?.email || '',
          status: userData?.status || 'offline',
          role: userData?.role || 'member'
        } as Member;
      });
  
      const members = await Promise.all(userDetailsPromises);
      return members.filter((member): member is Member => member !== null);
    } catch (error) {
      console.error('Error fetching member details:', error);
      return [];
    }
  },

  clearSelectedServer: () => set({ selectedServer: null, serverId: null }),
}));

export default useServerStore;
