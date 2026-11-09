import { create } from 'zustand';

export const usePlayerStore = create((set) => ({
  username: 'ReefRunner',
  profile: 'Lime',
  targetStat: 'SCC', // 'SCC' | 'FS' | 'Mixed'
  budget: 5000000,
  stats: {
    fishingLevel: 47,
    progressPercent: 49.6,
    scc: 64,
    fishingSpeed: 180,
    treasureChance: 12,
    fishingWisdom: 30,
    purse: 12450000,
    bank: 84200000,
  },
  savedBuilds: [
    { id: '1', name: 'Everyday fishing', scc: 64, speed: 180 },
    { id: '2', name: 'SCC · 5M plan', scc: 70, speed: 180 },
  ],
  setUsername: (username) => set({ username }),
  setProfile: (profile) => set({ profile }),
  setTargetStat: (targetStat) => set({ targetStat }),
  setBudget: (budget) => set({ budget }),
  addSavedBuild: (build) => set((state) => ({ savedBuilds: [...state.savedBuilds, build] })),
}));
