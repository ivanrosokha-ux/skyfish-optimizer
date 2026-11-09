import { usePlayerStore } from '../store/usePlayerStore';
import { Link } from 'react-router-dom';

export default function ProfilePage() {
  const { username, profile, stats, setUsername } = usePlayerStore();

  return (
    <div className="max-w-6xl mx-auto px-8 py-10 space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-[#e5e2de]">
          Fishing stats for <span className="text-[#269f4d]">{username}</span> on{' '}
          <span className="text-[#269f4d]">{profile}</span>
        </h1>
        <p className="text-[#87796a] text-sm mt-1">
          Your gear, your stats. A clearer path to your next catch.
        </p>
      </div>

      {/* Search Bar & Profiles */}
      <div className="space-y-4">
        <div>
          <label className="block text-xs text-[#87796a] mb-1.5 font-medium">
            Minecraft nickname
          </label>
          <div className="flex items-center gap-3 max-w-lg">
            <div className="relative flex-1">
              <span className="absolute left-3.5 top-3 text-[#87796a] text-xs">🔍</span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-[#14100e] border border-[#382b26] rounded-lg pl-9 pr-4 py-2.5 text-sm text-[#e5e2de] focus:outline-none focus:border-[#269f4d]"
                placeholder="ReefRunner"
              />
            </div>
            <button className="px-6 py-2.5 bg-[#269f4d] hover:bg-[#2eb557] text-white font-semibold text-sm rounded-lg transition shadow-sm">
              Search
            </button>
          </div>
        </div>

        {/* Profiles pills */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-[#87796a]">Profiles</span>
          <button className="px-3.5 py-1.5 rounded-lg bg-[#269f4d] text-white font-medium flex items-center gap-1.5 shadow-sm">
            <span>✓</span> Lime
          </button>
          <button className="px-3.5 py-1.5 rounded-lg bg-[#241c19] border border-[#382b26] text-[#87796a] hover:text-[#e5e2de] transition">
            Coconut
          </button>
          <button className="px-3.5 py-1.5 rounded-lg bg-[#241c19] border border-[#382b26] text-[#87796a] hover:text-[#e5e2de] transition">
            Papaya
          </button>
        </div>
      </div>

      {/* Main 2-column Grid: Armor & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Armor & Gear Card */}
        <div className="bg-[#241c19] border border-[#382b26] rounded-2xl p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-base text-[#e5e2de]">Armor</h2>
            <div className="flex items-center gap-1 bg-[#181310] p-1 rounded-lg border border-[#382b26] text-xs">
              <button className="px-3 py-1 rounded-md bg-[#269f4d] text-white font-medium">
                Gear
              </button>
              <button className="px-3 py-1 rounded-md text-[#87796a] hover:text-[#e5e2de]">
                Pets
              </button>
              <button className="px-3 py-1 rounded-md text-[#87796a] hover:text-[#e5e2de]">
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
                className="bg-[#181310] border border-[#269f4d] rounded-xl p-3.5 flex flex-col justify-between min-h-[110px]"
              >
                <div className="text-sm opacity-80">{item.icon}</div>
                <div className="space-y-0.5">
                  <div className="font-semibold text-xs text-[#e5e2de] leading-snug">
                    {item.name}
                  </div>
                  <div className="text-[10px] text-[#87796a]">Wise · Growth V</div>
                </div>
              </div>
            ))}
          </div>

          {/* Rod & Pet Row */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="bg-[#181310] border border-[#269f4d] rounded-xl p-3.5 flex flex-col justify-between min-h-[95px]">
              <div className="text-sm opacity-80">🎣</div>
              <div>
                <div className="font-semibold text-xs text-[#e5e2de]">Rod of the Sea</div>
                <div className="text-[10px] text-[#87796a]">Expertise V · Salty</div>
              </div>
            </div>

            <div className="bg-[#181310] border border-[#269f4d] rounded-xl p-3.5 flex flex-col justify-between min-h-[95px]">
              <div className="text-sm opacity-80">🐬</div>
              <div>
                <div className="font-semibold text-xs text-[#e5e2de]">Dolphin</div>
                <div className="text-[10px] text-[#87796a]">Level 80 · Epic</div>
              </div>
            </div>
          </div>
        </div>

        {/* Fishing Stats Card */}
        <div className="bg-[#241c19] border border-[#382b26] rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-base text-[#e5e2de]">Fishing stats</h2>
            <span className="text-xs text-[#87796a]">With equipped gear</span>
          </div>

          {/* Purse & Bank */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#181310] border border-[#382b26] rounded-xl p-3.5">
              <div className="text-[11px] text-[#87796a]">Purse</div>
              <div className="text-base font-bold font-mono text-[#e5e2de] mt-0.5">
                {stats.purse.toLocaleString()}
              </div>
            </div>
            <div className="bg-[#181310] border border-[#382b26] rounded-xl p-3.5">
              <div className="text-[11px] text-[#87796a]">Bank</div>
              <div className="text-base font-bold font-mono text-[#e5e2de] mt-0.5">
                {stats.bank.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Big Stats: SCC & Fishing Speed */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#181310] border border-[#382b26] rounded-xl p-4 relative">
              <span className="absolute right-3.5 top-3.5 text-[#269f4d] text-sm">🐟</span>
              <div className="text-xs text-[#87796a]">Sea Creature Chance</div>
              <div className="text-3xl font-extrabold text-[#269f4d] mt-1.5">
                {stats.scc} <span className="text-lg font-bold">%</span>
              </div>
              <div className="text-[11px] text-[#87796a] mt-1">Chance to hook a sea creature</div>
            </div>

            <div className="bg-[#181310] border border-[#382b26] rounded-xl p-4 relative">
              <span className="absolute right-3.5 top-3.5 text-[#269f4d] text-sm">⏱️</span>
              <div className="text-xs text-[#87796a]">Fishing Speed</div>
              <div className="text-3xl font-extrabold text-[#269f4d] mt-1.5">
                {stats.fishingSpeed}
              </div>
              <div className="text-[11px] text-[#87796a] mt-1">Reduces time between catches</div>
            </div>
          </div>

          {/* Treasure Chance & Fishing Wisdom */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#181310] border border-[#382b26] rounded-xl p-4 relative">
              <span className="absolute right-3.5 top-3.5 text-amber-500/80 text-sm">💎</span>
              <div className="text-xs text-[#87796a]">Treasure Chance</div>
              <div className="text-2xl font-bold text-[#e5e2de] mt-1">
                {stats.treasureChance} <span className="text-base font-semibold">%</span>
              </div>
              <div className="text-[11px] text-[#87796a] mt-0.5">
                Chance to find fishing treasure
              </div>
            </div>

            <div className="bg-[#181310] border border-[#382b26] rounded-xl p-4 relative">
              <span className="absolute right-3.5 top-3.5 text-blue-400/80 text-sm">📖</span>
              <div className="text-xs text-[#87796a]">Fishing Wisdom</div>
              <div className="text-2xl font-bold text-[#e5e2de] mt-1">{stats.fishingWisdom}</div>
              <div className="text-[11px] text-[#87796a] mt-0.5">
                Boosts fishing experience earned
              </div>
            </div>
          </div>

          {/* Bottom Link */}
          <div className="pt-2 flex items-center justify-between text-xs">
            <span className="text-[#87796a]">Find the best value for your next upgrade.</span>
            <Link to="/optimizer" className="text-[#269f4d] font-semibold hover:underline">
              Open optimizer →
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Progress Bar */}
      <div className="bg-[#241c19] border border-[#382b26] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <span className="text-base opacity-75">🎣</span>
          <div>
            <div className="font-bold text-[#e5e2de]">Fishing {stats.fishingLevel}</div>
            <div className="text-[11px] text-[#87796a]">1,240 / 2,500 XP</div>
          </div>
        </div>

        <div className="flex items-center gap-4 w-full sm:w-1/2">
          <div className="w-full bg-[#181310] border border-[#382b26] h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-[#bd9853] h-full rounded-full"
              style={{ width: `${stats.progressPercent}%` }}
            />
          </div>
          <span className="text-[#87796a] font-mono text-[11px] shrink-0">
            {stats.progressPercent}% to level 48
          </span>
        </div>
      </div>

      <div className="text-[11px] text-[#87796a] text-center pt-1">
        Last synced just now · Stats reflect your selected profile and equipped items.
      </div>
    </div>
  );
}
