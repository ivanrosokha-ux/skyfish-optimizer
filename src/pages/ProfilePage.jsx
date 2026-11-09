import { usePlayerStore } from '../store/usePlayerStore';
import { Link } from 'react-router-dom';

export default function ProfilePage() {
  const { username, profile, stats, setUsername } = usePlayerStore();

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">
          Fishing stats for <span className="text-emerald-400">{username}</span> on{' '}
          <span className="text-emerald-400">{profile}</span>
        </h1>
        <p className="text-zinc-400 text-sm mt-1">
          Your gear, your stats. A clearer path to your next catch.
        </p>
      </div>

      {/* Search Bar */}
      <div className="bg-surface border border-surface-border rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="bg-black/50 border border-surface-border rounded-lg px-4 py-2 text-sm text-zinc-100 focus:outline-none focus:border-emerald-500 w-full sm:w-64"
            placeholder="Minecraft nickname"
          />
          <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm rounded-lg transition">
            Search
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs text-zinc-400">
          <span>Profiles:</span>
          <span className="px-2.5 py-1 rounded bg-emerald-950/80 border border-emerald-800 text-emerald-300 font-semibold">
            ✓ Lime
          </span>
          <span className="px-2.5 py-1 rounded bg-black/40 border border-surface-border text-zinc-400">
            Coconut
          </span>
          <span className="px-2.5 py-1 rounded bg-black/40 border border-surface-border text-zinc-400">
            Papaya
          </span>
        </div>
      </div>

      {/* Main Grid: Gear & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gear Card */}
        <div className="bg-surface border border-surface-border rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-surface-border pb-3">
            <h2 className="font-bold text-base text-zinc-100">Armor & Gear</h2>
            <div className="flex gap-1 text-xs">
              <span className="px-2.5 py-1 rounded bg-emerald-600 text-white font-medium cursor-pointer">
                Gear
              </span>
              <span className="px-2.5 py-1 rounded bg-black/40 text-zinc-400 cursor-pointer">
                Pets
              </span>
              <span className="px-2.5 py-1 rounded bg-black/40 text-zinc-400 cursor-pointer">
                Stats
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            {["Diver's Mask", "Diver's Shirt", "Diver's Trunks", "Diver's Boots"].map((item) => (
              <div
                key={item}
                className="bg-black/40 border border-emerald-900/60 rounded-lg p-3 space-y-1"
              >
                <div className="text-[11px] text-zinc-500">Armor</div>
                <div className="font-semibold text-zinc-200">{item}</div>
                <div className="text-[10px] text-emerald-400 font-mono">Wise · Growth V</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs pt-2">
            <div className="bg-black/40 border border-surface-border rounded-lg p-3">
              <div className="text-[11px] text-zinc-500">Rod</div>
              <div className="font-semibold text-zinc-200">Rod of the Sea</div>
              <div className="text-[10px] text-emerald-400 font-mono">Expertise V · Salty</div>
            </div>
            <div className="bg-black/40 border border-surface-border rounded-lg p-3">
              <div className="text-[11px] text-zinc-500">Active Pet</div>
              <div className="font-semibold text-zinc-200">Dolphin</div>
              <div className="text-[10px] text-emerald-400 font-mono">Level 80 · Epic</div>
            </div>
          </div>
        </div>

        {/* Fishing Stats Card */}
        <div className="bg-surface border border-surface-border rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-surface-border pb-3">
            <h2 className="font-bold text-base text-zinc-100">Fishing Stats</h2>
            <span className="text-xs text-zinc-500">With equipped gear</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-black/40 border border-surface-border rounded-lg p-3.5">
              <div className="text-xs text-zinc-500">Purse</div>
              <div className="text-lg font-bold font-mono text-zinc-200 mt-1">
                {stats.purse.toLocaleString()}
              </div>
            </div>
            <div className="bg-black/40 border border-surface-border rounded-lg p-3.5">
              <div className="text-xs text-zinc-500">Bank</div>
              <div className="text-lg font-bold font-mono text-zinc-200 mt-1">
                {stats.bank.toLocaleString()}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-black/40 border border-surface-border rounded-lg p-4">
              <div className="text-xs text-zinc-400">Sea Creature Chance</div>
              <div className="text-3xl font-extrabold text-emerald-400 mt-1">{stats.scc}%</div>
              <div className="text-[11px] text-zinc-500 mt-1">Chance to hook a sea creature</div>
            </div>
            <div className="bg-black/40 border border-surface-border rounded-lg p-4">
              <div className="text-xs text-zinc-400">Fishing Speed</div>
              <div className="text-3xl font-extrabold text-amber-400 mt-1">
                {stats.fishingSpeed}
              </div>
              <div className="text-[11px] text-zinc-500 mt-1">Reduces time between catches</div>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <Link
              to="/optimizer"
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
            >
              Open optimizer →
            </Link>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-surface border border-surface-border rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div>
          <span className="font-bold text-zinc-200">Fishing {stats.fishingLevel}</span>
          <span className="text-zinc-500 ml-2">1,240 / 2,500 XP</span>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-1/2">
          <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-amber-500 h-full rounded-full"
              style={{ width: `${stats.progressPercent}%` }}
            />
          </div>
          <span className="text-zinc-400 font-mono text-[11px] shrink-0">
            {stats.progressPercent}% to lvl 48
          </span>
        </div>
      </div>
    </div>
  );
}
