import { usePlayerStore } from '../store/usePlayerStore';

export default function AccountPage() {
  const { username, setUsername, savedBuilds } = usePlayerStore();

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Account</h1>
        <p className="text-zinc-400 text-sm mt-1">
          Keep your builds together and see what each upgrade changes.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Account Details */}
        <div className="bg-surface border border-surface-border rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-surface-border pb-3">
            <h2 className="font-bold text-base text-zinc-100">Account details</h2>
            <span className="text-xs text-emerald-400 font-medium">Signed in</span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-zinc-400 block mb-1">Email</label>
              <input
                type="text"
                disabled
                value="angler@example.com"
                className="w-full bg-black/40 border border-surface-border rounded-lg px-3 py-2 text-zinc-400 font-mono"
              />
            </div>
            <div>
              <label className="text-zinc-400 block mb-1">Default nickname</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-black/50 border border-surface-border rounded-lg px-3 py-2 text-zinc-100 font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>
            <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg transition">
              Save
            </button>
          </div>
        </div>

        {/* Saved Builds */}
        <div className="bg-surface border border-surface-border rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-surface-border pb-3">
            <h2 className="font-bold text-base text-zinc-100">Saved builds</h2>
            <span className="text-xs text-zinc-500">{savedBuilds.length} saved builds</span>
          </div>

          <div className="space-y-3">
            {savedBuilds.map((b) => (
              <div
                key={b.id}
                className="bg-black/40 border border-surface-border rounded-lg p-3.5 space-y-1"
              >
                <div className="font-bold text-sm text-zinc-200">{b.name}</div>
                <div className="text-xs text-emerald-400 font-mono">
                  {b.scc}% SCC · {b.speed} speed
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Compare Builds Matrix */}
      <div className="bg-surface border border-surface-border rounded-xl p-6 space-y-4">
        <h2 className="font-bold text-base text-zinc-100 border-b border-surface-border pb-3">
          Compare builds
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="bg-black/40 p-3 rounded-lg border border-surface-border">
            <div className="text-zinc-500">Sea Creature Chance</div>
            <div className="text-base font-bold text-zinc-200 mt-1">64% → 70%</div>
            <div className="text-emerald-400 font-semibold mt-0.5">+6 pp</div>
          </div>
          <div className="bg-black/40 p-3 rounded-lg border border-surface-border">
            <div className="text-zinc-500">Fishing Speed</div>
            <div className="text-base font-bold text-zinc-200 mt-1">180 → 180</div>
            <div className="text-zinc-500 mt-0.5">No change</div>
          </div>
          <div className="bg-black/40 p-3 rounded-lg border border-surface-border">
            <div className="text-zinc-500">Treasure Chance</div>
            <div className="text-base font-bold text-zinc-200 mt-1">12% → 12%</div>
            <div className="text-zinc-500 mt-0.5">No change</div>
          </div>
          <div className="bg-black/40 p-3 rounded-lg border border-surface-border">
            <div className="text-zinc-500">Fishing Wisdom</div>
            <div className="text-base font-bold text-zinc-200 mt-1">30 → 30</div>
            <div className="text-zinc-500 mt-0.5">No change</div>
          </div>
        </div>
      </div>
    </div>
  );
}
