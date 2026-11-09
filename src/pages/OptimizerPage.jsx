import { useState } from 'react';
import { usePlayerStore } from '../store/usePlayerStore';

export default function OptimizerPage() {
  const { targetStat, setTargetStat, budget, setBudget, addSavedBuild, username, profile } =
    usePlayerStore();
  const [selectedFilters, setSelectedFilters] = useState([
    'Enchantments',
    'Armor',
    'Reforges',
    'Pet',
    'Accessory',
  ]);

  const upgrades = [
    {
      name: 'Angler V',
      note: 'Apply to fishing rod',
      type: 'Enchantment',
      gain: '+1 pp SCC',
      price: 400000,
      costPerStat: '400,000',
    },
    {
      name: 'Submerged',
      note: 'Reforge one armor piece',
      type: 'Reforge',
      gain: '+2 pp SCC',
      price: 1200000,
      costPerStat: '600,000',
    },
    {
      name: 'Deep Sea Orb',
      note: 'Accessory',
      type: 'Accessory',
      gain: '+3 pp SCC',
      price: 2400000,
      costPerStat: '800,000',
    },
    {
      name: 'Shark Scale set',
      note: "Replace Diver's armor",
      type: 'Armor',
      gain: '+4 pp SCC',
      price: 4000000,
      costPerStat: '1,000,000',
    },
    {
      name: 'Ammonite',
      note: 'Level 100 · Replace Dolphin',
      type: 'Pet',
      gain: '+5 pp SCC',
      price: 7500000,
      costPerStat: '1,500,000',
    },
  ];

  const handleSaveBuild = () => {
    addSavedBuild({
      id: Date.now().toString(),
      name: `SCC · 5M plan`,
      scc: 70,
      speed: 180,
    });
    alert('Build saved to your account!');
  };

  return (
    <div className="max-w-6xl mx-auto px-8 py-10 space-y-7">
      {/* Title & Player Tag */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-[#e5e2de]">Optimizer</h1>
          <p className="text-[#87796a] text-sm mt-1">
            Spend smarter. Rank upgrades by the stats that matter to you.
          </p>
        </div>
        <div className="text-xs text-[#87796a] font-mono">
          {username} / {profile}
        </div>
      </div>

      {/* Target Stat Switcher & Filter Chips */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          {['SCC', 'Fishing Speed', 'Mixed'].map((stat) => (
            <button
              key={stat}
              onClick={() => setTargetStat(stat)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition ${
                targetStat === stat
                  ? 'bg-[#269f4d] text-white'
                  : 'bg-[#241c19] border border-[#382b26] text-[#87796a] hover:text-[#e5e2de]'
              }`}
            >
              {stat}
            </button>
          ))}
          <span className="text-xs text-[#87796a] ml-auto">SCC = Sea Creature Chance</span>
        </div>

        <div className="flex flex-wrap gap-2 text-xs">
          {['Enchantments', 'Armor', 'Reforges', 'Pet', 'Accessory'].map((filter) => {
            const isSelected = selectedFilters.includes(filter);
            return (
              <button
                key={filter}
                onClick={() =>
                  setSelectedFilters((prev) =>
                    isSelected ? prev.filter((f) => f !== filter) : [...prev, filter]
                  )
                }
                className={`px-3 py-1.5 rounded-lg border transition flex items-center gap-1.5 ${
                  isSelected
                    ? 'border-[#269f4d] bg-[#181310] text-[#269f4d] font-medium'
                    : 'border-[#382b26] bg-[#241c19] text-[#87796a]'
                }`}
              >
                {isSelected && <span className="text-[#269f4d]">✓</span>}
                {filter}
              </button>
            );
          })}
        </div>
      </div>

      {/* Optimizer Grid: Table & Budget Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Table (2 cols) */}
        <div className="lg:col-span-2 bg-[#241c19] border border-[#382b26] rounded-2xl p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#382b26] pb-3">
              <div>
                <h2 className="font-bold text-base text-[#e5e2de]">Recommended upgrades</h2>
                <p className="text-xs text-[#87796a] mt-0.5">
                  Sorted by lowest cost per +1 percentage point of SCC.
                </p>
              </div>
              <span className="text-xs text-[#87796a]">{upgrades.length} upgrades</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="text-[#87796a] border-b border-[#382b26] text-[11px]">
                  <tr>
                    <th className="pb-3 font-normal">Upgrade</th>
                    <th className="pb-3 font-normal">Type</th>
                    <th className="pb-3 font-normal">Stat gain</th>
                    <th className="pb-3 font-normal">Price</th>
                    <th className="pb-3 font-normal text-right">Cost per +1 stat</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2d221e]">
                  {upgrades.map((u) => (
                    <tr key={u.name} className="hover:bg-[#181310]/50 transition-colors">
                      <td className="py-3.5 pr-2">
                        <div className="font-semibold text-xs text-[#e5e2de]">{u.name}</div>
                        <div className="text-[10px] text-[#87796a] mt-0.5">{u.note}</div>
                      </td>
                      <td className="py-3.5 text-[#87796a]">{u.type}</td>
                      <td className="py-3.5 text-[#269f4d] font-semibold">{u.gain}</td>
                      <td className="py-3.5 font-mono text-[#e5e2de]">
                        {u.price.toLocaleString()}
                      </td>
                      <td className="py-3.5 text-right font-mono text-[#e5e2de]">
                        {u.costPerStat}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="text-[10px] text-[#87796a] pt-3 border-t border-[#382b26]">
            Prices in coins · pp = percentage points · Estimated gains relative to your current
            gear.
          </div>
        </div>

        {/* Budget Calculator (1 col) */}
        <div className="bg-[#241c19] border border-[#382b26] rounded-2xl p-6 space-y-5">
          <h2 className="font-bold text-base text-[#e5e2de]">Budget calculator</h2>

          <div className="space-y-2">
            <label className="text-xs text-[#87796a] block">Your budget</label>
            <div className="flex items-center bg-[#14100e] border border-[#382b26] rounded-lg px-3 py-2.5 focus-within:border-[#269f4d]">
              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full bg-transparent text-sm text-[#e5e2de] font-mono focus:outline-none"
              />
              <span className="text-xs text-[#87796a] font-mono ml-2">coins</span>
            </div>
            <button className="w-full py-2.5 bg-[#269f4d] hover:bg-[#2eb557] text-white font-semibold text-xs rounded-lg transition shadow-sm">
              Calculate
            </button>
          </div>

          <div className="space-y-2 pt-2 border-t border-[#382b26] text-xs">
            <div className="text-[#87796a]">Recommended purchases</div>
            <div className="flex justify-between text-[#e5e2de]">
              <span>Angler V</span> <span className="font-mono text-[#87796a]">400,000</span>
            </div>
            <div className="flex justify-between text-[#e5e2de]">
              <span>Submerged</span> <span className="font-mono text-[#87796a]">1,200,000</span>
            </div>
            <div className="flex justify-between text-[#e5e2de]">
              <span>Deep Sea Orb</span> <span className="font-mono text-[#87796a]">2,400,000</span>
            </div>
          </div>

          <div className="space-y-1.5 pt-3 border-t border-[#382b26] text-xs">
            <div className="flex justify-between text-[#87796a]">
              <span>Total cost</span>
              <span className="font-mono text-[#e5e2de]">4,000,000</span>
            </div>
            <div className="flex justify-between text-[#87796a]">
              <span>Remaining budget</span>
              <span className="font-mono text-[#e5e2de]">1,000,000</span>
            </div>
            <div className="pt-2">
              <div className="text-[11px] text-[#87796a]">Projected Sea Creature Chance</div>
              <div className="flex items-baseline justify-between mt-0.5">
                <span className="text-lg font-bold text-[#e5e2de]">64% → 70%</span>
                <span className="text-sm font-semibold text-[#269f4d]">+6 pp</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleSaveBuild}
            className="w-full py-2.5 bg-[#181310] hover:bg-[#201814] border border-[#382b26] text-[#e5e2de] font-semibold text-xs rounded-lg transition"
          >
            Save build
          </button>
        </div>
      </div>
    </div>
  );
}
