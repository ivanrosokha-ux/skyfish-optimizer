import { useState } from 'react';
import { usePlayerStore } from '../store/usePlayerStore';

export default function OptimizerPage() {
  const { targetStat, setTargetStat, budget, setBudget, addSavedBuild } = usePlayerStore();
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
      name: `Optimized plan · ${budget.toLocaleString()} coins`,
      scc: 70,
      speed: 180,
    });
    alert('Build saved to your account!');
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Optimizer</h1>
        <p className="text-zinc-400 text-sm mt-1">
          Spend smarter. Rank upgrades by the stats that matter to you.
        </p>
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
                  ? 'bg-emerald-600 text-white'
                  : 'bg-surface border border-surface-border text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {stat}
            </button>
          ))}
          <span className="text-xs text-zinc-500 ml-auto">SCC = Sea Creature Chance</span>
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
                className={`px-3 py-1.5 rounded-lg border transition ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-950/40 text-emerald-300 font-medium'
                    : 'border-surface-border bg-surface text-zinc-500'
                }`}
              >
                {isSelected ? '✓ ' : ''}
                {filter}
              </button>
            );
          })}
        </div>
      </div>

      {/* Optimizer Grid: Table & Budget Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Table (2 cols) */}
        <div className="lg:col-span-2 bg-surface border border-surface-border rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-surface-border pb-3">
            <div>
              <h2 className="font-bold text-base text-zinc-100">Recommended upgrades</h2>
              <p className="text-xs text-zinc-500 mt-0.5">
                Sorted by lowest cost per +1 percentage point of SCC.
              </p>
            </div>
            <span className="text-xs text-zinc-500">{upgrades.length} upgrades</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-zinc-500 border-b border-surface-border/60 font-mono text-[11px]">
                <tr>
                  <th className="pb-2">Upgrade</th>
                  <th className="pb-2">Type</th>
                  <th className="pb-2">Stat gain</th>
                  <th className="pb-2">Price</th>
                  <th className="pb-2 text-right">Cost per +1 stat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border/40">
                {upgrades.map((u) => (
                  <tr key={u.name} className="hover:bg-zinc-900/50">
                    <td className="py-3 pr-2">
                      <div className="font-semibold text-zinc-200">{u.name}</div>
                      <div className="text-[10px] text-zinc-500">{u.note}</div>
                    </td>
                    <td className="py-3 text-zinc-400">{u.type}</td>
                    <td className="py-3 text-emerald-400 font-semibold">{u.gain}</td>
                    <td className="py-3 font-mono text-zinc-300">{u.price.toLocaleString()}</td>
                    <td className="py-3 text-right font-mono text-emerald-400 font-semibold">
                      {u.costPerStat}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Budget Calculator (1 col) */}
        <div className="bg-surface border border-surface-border rounded-xl p-6 space-y-4">
          <h2 className="font-bold text-base text-zinc-100 border-b border-surface-border pb-3">
            Budget calculator
          </h2>

          <div className="space-y-1.5">
            <label className="text-xs text-zinc-400">Your budget</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full bg-black/50 border border-surface-border rounded-lg px-3 py-2 text-sm text-zinc-100 font-mono focus:outline-none focus:border-emerald-500"
              />
              <span className="text-xs text-zinc-500 font-mono">coins</span>
            </div>
            <button className="w-full mt-2 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-lg transition">
              Calculate
            </button>
          </div>

          <div className="space-y-2 pt-2 border-t border-surface-border text-xs">
            <div className="text-zinc-500 font-semibold">Recommended purchases:</div>
            <div className="flex justify-between text-zinc-300">
              <span>Angler V</span> <span className="font-mono">400,000</span>
            </div>
            <div className="flex justify-between text-zinc-300">
              <span>Submerged</span> <span className="font-mono">1,200,000</span>
            </div>
            <div className="flex justify-between text-zinc-300">
              <span>Deep Sea Orb</span> <span className="font-mono">2,400,000</span>
            </div>
          </div>

          <div className="space-y-1.5 pt-3 border-t border-surface-border text-xs">
            <div className="flex justify-between text-zinc-400">
              <span>Total cost:</span>
              <span className="font-mono text-zinc-200">4,000,000</span>
            </div>
            <div className="flex justify-between text-zinc-400">
              <span>Remaining budget:</span>
              <span className="font-mono text-zinc-200">1,000,000</span>
            </div>
            <div className="flex justify-between pt-1 font-bold text-sm">
              <span>Projected SCC:</span>
              <span className="text-emerald-400">64% → 70% (+6 pp)</span>
            </div>
          </div>

          <button
            onClick={handleSaveBuild}
            className="w-full py-2 bg-surface hover:bg-zinc-800 border border-surface-border text-zinc-200 font-semibold text-xs rounded-lg transition"
          >
            Save build
          </button>
        </div>
      </div>
    </div>
  );
}
