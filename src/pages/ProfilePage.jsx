import { usePlayerStore } from '../store/usePlayerStore';
import { Link } from 'react-router-dom';

export default function ProfilePage() {
  const { username, profile, stats, setUsername } = usePlayerStore();

  return (
    <div className="max-w-6xl mx-auto px-8 py-10 space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-[#F5F1EC]">
          Fishing stats for <span className="text-[#1FA64A]">{username}</span> on{' '}
          <span className="text-[#1FA64A]">{profile}</span>
        </h1>
        <p className="text-[#A39A92] text-sm mt-1">
          Your gear, your stats. A clearer path to your next catch.
        </p>
      </div>

      {/* Search Bar & Profiles */}
      <div className="space-y-4">
        <div>
          <label className="block text-xs text-[#A39A92] mb-1.5 font-medium">
            Minecraft nickname
          </label>
          <div className="flex items-center gap-3 max-w-lg">
            <div className="relative flex-1">
              <span className="absolute left-3.5 top-3 text-[#A39A92] text-xs">🔍</span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-[#1A1411] border border-[#3A2F29] rounded-lg pl-9 pr-4 py-2.5 text-sm text-[#F5F1EC] focus:outline-none focus:border-[#1FA64A]"
                placeholder="ReefRunner"
              />
            </div>
            <button className="px-6 py-2.5 bg-[#1FA64A] hover:bg-[#26bd56] text-white font-semibold text-sm rounded-lg transition shadow-sm">
              Search
            </button>
          </div>
        </div>

        {/* Profiles pills */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-[#A39A92]">Profiles</span>
          <button className="px-3.5 py-1.5 rounded-lg bg-[#1FA64A] text-white font-medium flex items-center gap-1.5 shadow-sm">
            <span>✓</span> Lime
          </button>
          <button className="px-3.5 py-1.5 rounded-lg bg-[#241C18] border border-[#3A2F29] text-[#A39A92] hover:text-[#F5F1EC] transition">
            Coconut
          </button>
          <button className="px-3.5 py-1.5 rounded-lg bg-[#241C18] border border-[#3A2F29] text-[#A39A92] hover:text-[#F5F1EC] transition">
            Papaya
          </button>
        </div>
      </div>

      {/* Main 2-column Grid: Armor & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Armor & Gear Card */}
        <div className="bg-[#241C18] border border-[#3A2F29] rounded-2xl p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-base text-[#F5F1EC]">Armor</h2>
            <div className="flex items-center gap-1 bg-[#1A1411] p-1 rounded-lg border border-[#3A2F29] text-xs">
              <button className="px-3 py-1 rounded-md bg-[#1FA64A] text-white font-medium">
                Gear
              </button>
              <button className="px-3 py-1 rounded-md text-[#A39A92] hover:text-[#F5F1EC]">
                Pets
              </button>
              <button className="px-3 py-1 rounded-md text-[#A39A92] hover:text-[#F5F1EC]">
                Stats
              </button>
            </div>
          </div>

          {/* 4 Armor Pieces Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { slot: 'helmet', name: "Diver's Mask", icon: '⛑️' },
              { slot: 'chest', name: "Diver's Shirt", icon: '👕' },
              { slot: 'legs', name: "Diver's Trunks", icon: '🛡️' },
              { slot: 'boots', name: "Diver's Boots", icon: '🥾' },
            ].map((item) => (
              <div
                key={item.name}
                className="bg-[#1A1411] border border-[#1FA64A] rounded-xl p-3.5 flex flex-col justify-between min-h-[110px]"
              >
                <div className="text-sm opacity-80">{item.icon}</div>
                <div className="space-y-0.5">
                  <div className="font-semibold text-xs text-[#F5F1EC] leading-snug">
                    {item.name}
                  </div>
                  <div className="text-[10px] text-[#A39A92]">Wise · Growth V</div>
                </div>
              </div>
            ))}
          </div>

          {/* Rod & Pet Row */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="bg-[#1A1411] border border-[#1FA64A] rounded-xl p-3.5 flex flex-col justify-between min-h-[95px]">
              <div className="text-sm opacity-80">🎣</div>
              <div>
                <div className="font-semibold text-xs text-[#F5F1EC]">Rod of the Sea</div>
                <div className="text-[10px] text-[#A39A92]">Expertise V · Salty</div>
              </div>
            </div>

            <div className="bg-[#1A1411] border border-[#1FA64A] rounded-xl p-3.5 flex flex-col justify-between min-h-[95px]">
              <div className="text-sm opacity-80">🐬</div>
              <div>
                <div className="font-semibold text-xs text-[#F5F1EC]">Dolphin</div>
                <div className="text-[10px] text-[#A39A92]">Level 80 · Epic</div>
              </div>
            </div>
          </div>
        </div>

        {/* Fishing Stats Card */}
        <div className="bg-[#241C18] border border-[#3A2F29] rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-base text-[#F5F1EC]">Fishing stats</h2>
            <span className="text-xs text-[#A39A92]">With equipped gear</span>
          </div>

          {/* Purse & Bank */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#1A1411] border border-[#3A2F29] rounded-xl p-3.5">
              <div className="text-[11px] text-[#A39A92]">Purse</div>
              <div className="text-base font-bold font-mono text-[#F5F1EC] mt-0.5">
                {stats.purse.toLocaleString()}
              </div>
            </div>
            <div className="bg-[#1A1411] border border-[#3A2F29] rounded-xl p-3.5">
              <div className="text-[11px] text-[#A39A92]">Bank</div>
              <div className="text-base font-bold font-mono text-[#F5F1EC] mt-0.5">
                {stats.bank.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Big Stats: SCC & Fishing Speed */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#1A1411] border border-[#3A2F29] rounded-xl p-4 relative">
              <span className="absolute right-3.5 top-3.5 text-[#3ED16B] text-sm">🐟</span>
              <div className="text-xs text-[#A39A92]">Sea Creature Chance</div>
              <div className="text-3xl font-extrabold text-[#3ED16B] mt-1.5">
                {stats.scc} <span className="text-lg font-bold">%</span>
              </div>
              <div className="text-[11px] text-[#A39A92] mt-1">Chance to hook a sea creature</div>
            </div>

            <div className="bg-[#1A1411] border border-[#3A2F29] rounded-xl p-4 relative">
              <span className="absolute right-3.5 top-3.5 text-[#1FA64A] text-sm">⏱️</span>
              <div className="text-xs text-[#A39A92]">Fishing Speed</div>
              <div className="text-3xl font-extrabold text-[#1FA64A] mt-1.5">
                {stats.fishingSpeed}
              </div>
              <div className="text-[11px] text-[#A39A92] mt-1">Reduces time between catches</div>
            </div>
          </div>

          {/* Treasure Chance & Fishing Wisdom */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#1A1411] border border-[#3A2F29] rounded-xl p-4 relative">
              <span className="absolute right-3.5 top-3.5 text-[#D9A21B] text-sm">💎</span>
              <div className="text-xs text-[#A39A92]">Treasure Chance</div>
              <div className="text-2xl font-bold text-[#F5F1EC] mt-1">
                {stats.treasureChance} <span className="text-base font-semibold">%</span>
              </div>
              <div className="text-[11px] text-[#A39A92] mt-0.5">
                Chance to find fishing treasure
              </div>
            </div>

            <div className="bg-[#1A1411] border border-[#3A2F29] rounded-xl p-4 relative">
              <span className="absolute right-3.5 top-3.5 text-blue-400 text-sm">📖</span>
              <div className="text-xs text-[#A39A92]">Fishing Wisdom</div>
              <div className="text-2xl font-bold text-[#F5F1EC] mt-1">{stats.fishingWisdom}</div>
              <div className="text-[11px] text-[#A39A92] mt-0.5">
                Boosts fishing experience earned
              </div>
            </div>
          </div>

          {/* Bottom Link */}
          <div className="pt-2 flex items-center justify-between text-xs">
            <span className="text-[#A39A92]">Find the best value for your next upgrade.</span>
            <Link to="/optimizer" className="text-[#1FA64A] font-semibold hover:underline">
              Open optimizer →
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Progress Bar */}
      <div className="bg-[#241C18] border border-[#3A2F29] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <span className="text-base opacity-75">🎣</span>
          <div>
            <div className="font-bold text-[#F5F1EC]">Fishing {stats.fishingLevel}</div>
            <div className="text-[11px] text-[#A39A92]">1,240 / 2,500 XP</div>
          </div>
        </div>

        <div className="flex items-center gap-4 w-full sm:w-1/2">
          <div className="w-full bg-[#4A413B] h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-[#D9A21B] h-full rounded-full"
              style={{ width: `${stats.progressPercent}%` }}
            />
          </div>
          <span className="text-[#A39A92] font-mono text-[11px] shrink-0">
            {stats.progressPercent}% to level 48
          </span>
        </div>
      </div>

      <div className="text-[11px] text-[#A39A92] text-center pt-1">
        Last synced just now · Stats reflect your selected profile and equipped items.
      </div>
    </div>
  );
}
