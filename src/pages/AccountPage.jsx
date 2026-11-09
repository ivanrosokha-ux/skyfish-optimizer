import { usePlayerStore } from '../store/usePlayerStore';

export default function AccountPage() {
  const { username, setUsername } = usePlayerStore();

  return (
    <div className="max-w-6xl mx-auto px-8 py-10 space-y-7">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-[#e5e2de]">Account</h1>
        <p className="text-[#87796a] text-sm mt-1">
          Keep your builds together and see what each upgrade changes.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Account Details */}
        <div className="bg-[#241c19] border border-[#382b26] rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#382b26] pb-3">
            <h2 className="font-bold text-base text-[#e5e2de]">Account details</h2>
            <span className="text-xs text-[#269f4d] font-medium">Signed in</span>
          </div>

          <div className="space-y-3.5 text-xs">
            <div>
              <label className="text-[#87796a] block mb-1.5">Email</label>
              <div className="relative">
                <span className="absolute left-3.5 top-3 text-[#87796a] text-xs">✉️</span>
                <input
                  type="text"
                  disabled
                  value="angler@example.com"
                  className="w-full bg-[#14100e] border border-[#382b26] rounded-lg pl-9 pr-3 py-2.5 text-[#87796a] font-mono"
                />
              </div>
            </div>

            <div>
              <label className="text-[#87796a] block mb-1.5">Default nickname</label>
              <div className="relative">
                <span className="absolute left-3.5 top-3 text-[#87796a] text-xs">✉️</span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-[#14100e] border border-[#382b26] rounded-lg pl-9 pr-3 py-2.5 text-[#e5e2de] font-mono focus:outline-none focus:border-[#269f4d]"
                />
              </div>
            </div>

            <button className="w-full py-2.5 bg-[#269f4d] hover:bg-[#2eb557] text-white font-semibold rounded-lg transition shadow-sm">
              Save
            </button>
          </div>
        </div>

        {/* Saved Builds */}
        <div className="bg-[#241c19] border border-[#382b26] rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#382b26] pb-3">
            <h2 className="font-bold text-base text-[#e5e2de]">Saved builds</h2>
            <span className="text-xs text-[#87796a]">2 saved builds</span>
          </div>

          <div className="space-y-3 text-xs">
            {/* Build 1 */}
            <div className="bg-[#181310] border border-[#382b26] rounded-xl p-4 space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[#87796a]">🔖</span>
                <span className="font-bold text-sm text-[#e5e2de]">Everyday fishing</span>
              </div>
              <div className="text-[11px] text-[#87796a]">Current equipment · Lime</div>
              <div className="text-xs text-[#269f4d] font-mono pt-1">
                64% SCC &nbsp;&nbsp; 180 speed
              </div>
            </div>

            {/* Build 2 */}
            <div className="bg-[#181310] border border-[#382b26] rounded-xl p-4 space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[#87796a]">🔖</span>
                <span className="font-bold text-sm text-[#e5e2de]">SCC · 5M plan</span>
              </div>
              <div className="text-[11px] text-[#87796a]">3 upgrades · 4,000,000 coins</div>
              <div className="text-xs text-[#269f4d] font-mono pt-1">
                70% SCC &nbsp;&nbsp; 180 speed
              </div>
            </div>
          </div>

          <div className="text-[11px] text-[#87796a] flex items-center gap-1.5 pt-2">
            <span>🔏</span> Builds saved to your account.
          </div>
        </div>
      </div>

      {/* Compare Builds Matrix */}
      <div className="bg-[#241c19] border border-[#382b26] rounded-2xl p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-[#382b26] pb-3">
          <h2 className="font-bold text-base text-[#e5e2de]">Compare builds</h2>
          <span className="text-xs text-[#87796a]">Before vs After</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-xs">
          {/* Selectors Column */}
          <div className="space-y-3">
            <div>
              <div className="text-[#87796a] mb-1">Before</div>
              <div className="bg-[#14100e] border border-[#382b26] rounded-lg px-3 py-2 text-[#e5e2de] flex justify-between items-center font-medium">
                <span>Everyday fishing</span> <span className="text-[#87796a]">▾</span>
              </div>
            </div>
            <div>
              <div className="text-[#87796a] mb-1">After</div>
              <div className="bg-[#14100e] border border-[#382b26] rounded-lg px-3 py-2 text-[#e5e2de] flex justify-between items-center font-medium">
                <span>SCC · 5M plan</span> <span className="text-[#87796a]">▾</span>
              </div>
            </div>
          </div>

          {/* Metric 1: SCC */}
          <div className="bg-[#181310] border border-[#382b26] rounded-xl p-3.5 flex flex-col justify-between">
            <div className="text-[#87796a]">Sea Creature Chance</div>
            <div className="space-y-0.5 my-2">
              <div className="font-bold text-sm text-[#e5e2de]">
                64% <span className="text-[10px] text-[#87796a] font-normal">Before</span>
              </div>
              <div className="font-bold text-sm text-[#e5e2de]">
                70% <span className="text-[10px] text-[#87796a] font-normal">After</span>
              </div>
            </div>
            <div className="text-xs font-semibold text-[#269f4d]">+6 pp</div>
          </div>

          {/* Metric 2: Speed */}
          <div className="bg-[#181310] border border-[#382b26] rounded-xl p-3.5 flex flex-col justify-between">
            <div className="text-[#87796a]">Fishing Speed</div>
            <div className="space-y-0.5 my-2">
              <div className="font-bold text-sm text-[#269f4d]">
                180 <span className="text-[10px] text-[#87796a] font-normal">Before</span>
              </div>
              <div className="font-bold text-sm text-[#269f4d]">
                180 <span className="text-[10px] text-[#87796a] font-normal">After</span>
              </div>
            </div>
            <div className="text-xs text-[#87796a]">No change</div>
          </div>

          {/* Metric 3: Treasure */}
          <div className="bg-[#181310] border border-[#382b26] rounded-xl p-3.5 flex flex-col justify-between">
            <div className="text-[#87796a]">Treasure Chance</div>
            <div className="space-y-0.5 my-2">
              <div className="font-bold text-sm text-[#e5e2de]">
                12% <span className="text-[10px] text-[#87796a] font-normal">Before</span>
              </div>
              <div className="font-bold text-sm text-[#e5e2de]">
                12% <span className="text-[10px] text-[#87796a] font-normal">After</span>
              </div>
            </div>
            <div className="text-xs text-[#87796a]">No change</div>
          </div>

          {/* Metric 4: Wisdom */}
          <div className="bg-[#181310] border border-[#382b26] rounded-xl p-3.5 flex flex-col justify-between">
            <div className="text-[#87796a]">Fishing Wisdom</div>
            <div className="space-y-0.5 my-2">
              <div className="font-bold text-sm text-[#e5e2de]">
                30 <span className="text-[10px] text-[#87796a] font-normal">Before</span>
              </div>
              <div className="font-bold text-sm text-[#e5e2de]">
                30 <span className="text-[10px] text-[#87796a] font-normal">After</span>
              </div>
            </div>
            <div className="text-xs text-[#87796a]">No change</div>
          </div>
        </div>
      </div>
    </div>
  );
}
