import { usePlayerStore } from '../store/usePlayerStore';

export default function AccountPage() {
  const { username, setUsername } = usePlayerStore();

  return (
    <div className="max-w-6xl mx-auto px-8 py-10 space-y-7">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-[#F5F1EC]">Account</h1>
        <p className="text-[#A39A92] text-sm mt-1">
          Keep your builds together and see what each upgrade changes.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Account Details */}
        <div className="bg-[#241C18] border border-[#3A2F29] rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#3A2F29] pb-3">
            <h2 className="font-bold text-base text-[#F5F1EC]">Account details</h2>
            <span className="text-xs text-[#1FA64A] font-medium">Signed in</span>
          </div>

          <div className="space-y-3.5 text-xs">
            <div>
              <label className="text-[#A39A92] block mb-1.5">Email</label>
              <div className="relative">
                <span className="absolute left-3.5 top-3 text-[#A39A92] text-xs">✉️</span>
                <input
                  type="text"
                  disabled
                  value="angler@example.com"
                  className="w-full bg-[#1A1411] border border-[#3A2F29] rounded-lg pl-9 pr-3 py-2.5 text-[#A39A92] font-mono"
                />
              </div>
            </div>

            <div>
              <label className="text-[#A39A92] block mb-1.5">Default nickname</label>
              <div className="relative">
                <span className="absolute left-3.5 top-3 text-[#A39A92] text-xs">✉️</span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-[#1A1411] border border-[#3A2F29] rounded-lg pl-9 pr-3 py-2.5 text-[#F5F1EC] font-mono focus:outline-none focus:border-[#1FA64A]"
                />
              </div>
            </div>

            <button className="w-full py-2.5 bg-[#1FA64A] hover:bg-[#26bd56] text-white font-semibold rounded-lg transition shadow-sm">
              Save
            </button>
          </div>
        </div>

        {/* Saved Builds */}
        <div className="bg-[#241C18] border border-[#3A2F29] rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#3A2F29] pb-3">
            <h2 className="font-bold text-base text-[#F5F1EC]">Saved builds</h2>
            <span className="text-xs text-[#A39A92]">2 saved builds</span>
          </div>

          <div className="space-y-3 text-xs">
            {/* Build 1 */}
            <div className="bg-[#1A1411] border border-[#3A2F29] rounded-xl p-4 space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[#A39A92]">🔖</span>
                <span className="font-bold text-sm text-[#F5F1EC]">Everyday fishing</span>
              </div>
              <div className="text-[11px] text-[#A39A92]">Current equipment · Lime</div>
              <div className="text-xs text-[#1FA64A] font-mono pt-1">
                64% SCC &nbsp;&nbsp; 180 speed
              </div>
            </div>

            {/* Build 2 */}
            <div className="bg-[#1A1411] border border-[#3A2F29] rounded-xl p-4 space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[#A39A92]">🔖</span>
                <span className="font-bold text-sm text-[#F5F1EC]">SCC · 5M plan</span>
              </div>
              <div className="text-[11px] text-[#A39A92]">3 upgrades · 4,000,000 coins</div>
              <div className="text-xs text-[#1FA64A] font-mono pt-1">
                70% SCC &nbsp;&nbsp; 180 speed
              </div>
            </div>
          </div>

          <div className="text-[11px] text-[#A39A92] flex items-center gap-1.5 pt-2">
            <span>🔏</span> Builds saved to your account.
          </div>
        </div>
      </div>

      {/* Compare Builds Matrix */}
      <div className="bg-[#241C18] border border-[#3A2F29] rounded-2xl p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-[#3A2F29] pb-3">
          <h2 className="font-bold text-base text-[#F5F1EC]">Compare builds</h2>
          <span className="text-xs text-[#A39A92]">Before vs After</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-xs">
          {/* Selectors Column */}
          <div className="space-y-3">
            <div>
              <div className="text-[#A39A92] mb-1">Before</div>
              <div className="bg-[#1A1411] border border-[#3A2F29] rounded-lg px-3 py-2 text-[#F5F1EC] flex justify-between items-center font-medium">
                <span>Everyday fishing</span> <span className="text-[#A39A92]">▾</span>
              </div>
            </div>
            <div>
              <div className="text-[#A39A92] mb-1">After</div>
              <div className="bg-[#1A1411] border border-[#3A2F29] rounded-lg px-3 py-2 text-[#F5F1EC] flex justify-between items-center font-medium">
                <span>SCC · 5M plan</span> <span className="text-[#A39A92]">▾</span>
              </div>
            </div>
          </div>

          {/* Metric 1: SCC */}
          <div className="bg-[#1A1411] border border-[#3A2F29] rounded-xl p-3.5 flex flex-col justify-between">
            <div className="text-[#A39A92]">Sea Creature Chance</div>
            <div className="space-y-0.5 my-2">
              <div className="font-bold text-sm text-[#F5F1EC]">
                64% <span className="text-[10px] text-[#A39A92] font-normal">Before</span>
              </div>
              <div className="font-bold text-sm text-[#F5F1EC]">
                70% <span className="text-[10px] text-[#A39A92] font-normal">After</span>
              </div>
            </div>
            <div className="text-xs font-semibold text-[#3ED16B]">+6 pp</div>
          </div>

          {/* Metric 2: Speed */}
          <div className="bg-[#1A1411] border border-[#3A2F29] rounded-xl p-3.5 flex flex-col justify-between">
            <div className="text-[#A39A92]">Fishing Speed</div>
            <div className="space-y-0.5 my-2">
              <div className="font-bold text-sm text-[#1FA64A]">
                180 <span className="text-[10px] text-[#A39A92] font-normal">Before</span>
              </div>
              <div className="font-bold text-sm text-[#1FA64A]">
                180 <span className="text-[10px] text-[#A39A92] font-normal">After</span>
              </div>
            </div>
            <div className="text-xs text-[#A39A92]">No change</div>
          </div>

          {/* Metric 3: Treasure */}
          <div className="bg-[#1A1411] border border-[#3A2F29] rounded-xl p-3.5 flex flex-col justify-between">
            <div className="text-[#A39A92]">Treasure Chance</div>
            <div className="space-y-0.5 my-2">
              <div className="font-bold text-sm text-[#F5F1EC]">
                12% <span className="text-[10px] text-[#A39A92] font-normal">Before</span>
              </div>
              <div className="font-bold text-sm text-[#F5F1EC]">
                12% <span className="text-[10px] text-[#A39A92] font-normal">After</span>
              </div>
            </div>
            <div className="text-xs text-[#A39A92]">No change</div>
          </div>

          {/* Metric 4: Wisdom */}
          <div className="bg-[#1A1411] border border-[#3A2F29] rounded-xl p-3.5 flex flex-col justify-between">
            <div className="text-[#A39A92]">Fishing Wisdom</div>
            <div className="space-y-0.5 my-2">
              <div className="font-bold text-sm text-[#F5F1EC]">
                30 <span className="text-[10px] text-[#A39A92] font-normal">Before</span>
              </div>
              <div className="font-bold text-sm text-[#F5F1EC]">
                30 <span className="text-[10px] text-[#A39A92] font-normal">After</span>
              </div>
            </div>
            <div className="text-xs text-[#A39A92]">No change</div>
          </div>
        </div>
      </div>
    </div>
  );
}
