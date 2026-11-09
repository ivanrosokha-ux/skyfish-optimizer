import { create } from 'zustand';

export const usePlayerStore = create((set) => ({
  username: 'ReefRunner',
  profile: 'Lime',
  targetStat: 'SCC', // 'SCC' | 'Fishing Speed' | 'Mixed'
  budget: 5000000,
  stats: {
    fishingLevel: 47,
    progressPercent: 49.6,
    scc: 64,
    fishingSpeed: 180,
    treasureChance: 12,
    fishingWisdom: 30,
    purse: 14200000,
    bank: 45000000,
  },
  savedBuilds: [
    {
      id: '1',
      name: 'Everyday fishing',
      scc: 64,
      speed: 180,
      treasure: 12,
      wisdom: 30,
      cost: 0,
      meta: 'Current equipment · Lime',
    },
    {
      id: '2',
      name: 'SCC · 5M plan',
      scc: 70,
      speed: 180,
      treasure: 12,
      wisdom: 30,
      cost: 4000000,
      meta: '3 upgrades · 4,000,000 coins',
    },
  ],
  setUsername: (username) => set({ username }),
  setProfile: (profile) => set({ profile }),
  setTargetStat: (targetStat) => set({ targetStat }),
  setBudget: (budget) => set({ budget }),
  setStats: (newStats) => set((state) => ({ stats: { ...state.stats, ...newStats } })),
  addSavedBuild: (build) => set((state) => ({ savedBuilds: [...state.savedBuilds, build] })),
  removeSavedBuild: (id) =>
    set((state) => ({
      savedBuilds: state.savedBuilds.filter((b) => b.id !== id),
    })),
}));
