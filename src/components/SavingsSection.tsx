'use client';

import React, { useState } from 'react';
import { useFinance } from '@/context/FinanceContext';
import { formatRupiah } from '@/lib/utils';
import { 
  PiggyBank, 
  Plus, 
  Trash2, 
  Target, 
  ShieldAlert, 
  Wrench, 
  Compass, 
  Smartphone, 
  X,
  Coins
} from 'lucide-react';

const categoryIcons = {
  darurat: ShieldAlert,
  kendaraan: Wrench,
  mudik: Compass,
  gadget: Smartphone,
  lainnya: Target,
};

export function SavingsSection() {
  const { savings, addSavingGoal, updateSavingProgress, deleteSavingGoal } = useFinance();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState<number | ''>('');
  const [initialAmount, setInitialAmount] = useState<number | ''>('');
  const [category, setCategory] = useState<'darurat' | 'kendaraan' | 'mudik' | 'gadget' | 'lainnya'>('darurat');

  const totalTarget = savings.reduce((sum, g) => sum + g.targetAmount, 0);
  const totalSaved = savings.reduce((sum, g) => sum + g.currentAmount, 0);
  const overallPercentage = totalTarget > 0 ? Math.min(100, Math.round((totalSaved / totalTarget) * 100)) : 0;

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !targetAmount || Number(targetAmount) <= 0) return;

    addSavingGoal({
      name: name.trim(),
      targetAmount: Number(targetAmount),
      currentAmount: Number(initialAmount) || 0,
      category,
    });

    // Reset & close
    setName('');
    setTargetAmount('');
    setInitialAmount('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-4">
      {/* Header and Summary Banner */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4 sm:p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
              <PiggyBank className="w-4 h-4 text-emerald-500" />
              Target Tabungan & Dana Darurat Kos
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Sediakan payung sebelum hujan untuk kebutuhan mendadak & rencana pulang kampung
            </p>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1 self-start sm:self-auto transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Target</span>
          </button>
        </div>

        {/* Progress Bar Banner */}
        <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-700/60">
          <div className="flex items-center justify-between text-xs sm:text-sm mb-2">
            <span className="text-zinc-600 dark:text-zinc-300 font-medium">
              Total Tabungan Terkumpul:
            </span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">
              {formatRupiah(totalSaved)} / {formatRupiah(totalTarget)} ({overallPercentage}%)
            </span>
          </div>

          <div className="w-full bg-zinc-200 dark:bg-zinc-700 h-2.5 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 transition-all duration-500"
              style={{ width: `${overallPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Saving Goals Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {savings.map((goal) => {
          const Icon = categoryIcons[goal.category || 'lainnya'] || Target;
          const percentage = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
          const isDone = goal.currentAmount >= goal.targetAmount;

          return (
            <div
              key={goal.id}
              className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4 sm:p-5 shadow-sm space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-zinc-900 dark:text-white">
                      {goal.name}
                    </h4>
                    <span className="text-[11px] text-zinc-400">
                      Target: {formatRupiah(goal.targetAmount)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => deleteSavingGoal(goal.id)}
                  className="p-1 rounded-lg text-zinc-400 hover:text-rose-500 transition-colors"
                  title="Hapus target"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Progress */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                    {formatRupiah(goal.currentAmount)}
                  </span>
                  <span className={`font-bold ${isDone ? 'text-emerald-500' : 'text-zinc-400'}`}>
                    {percentage}% {isDone && '🎉 Tercapai!'}
                  </span>
                </div>

                <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${isDone ? 'bg-emerald-500' : 'bg-emerald-600'}`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>

              {/* Quick Add Fund Buttons */}
              <div className="pt-1">
                <span className="text-[10px] text-zinc-400 block mb-1">
                  Nabung Cepat:
                </span>
                <div className="flex items-center gap-1.5">
                  {[10000, 25000, 50000].map((amt) => (
                    <button
                      key={amt}
                      onClick={() => updateSavingProgress(goal.id, amt)}
                      className="px-2 py-1 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 text-[11px] font-medium transition-colors"
                    >
                      +{amt >= 1000 ? `${amt / 1000}rb` : amt}
                    </button>
                  ))}
                  {goal.currentAmount > 0 && (
                    <button
                      onClick={() => updateSavingProgress(goal.id, -10000)}
                      className="px-2 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/30 text-rose-600 text-[11px] font-medium transition-colors"
                      title="Ambil tabungan untuk darurat"
                    >
                      -10rb
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Tambah Target Tabungan */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 p-6 overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800 mb-4">
              <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                Tambah Target Tabungan
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-500 mb-1">
                  Nama Target
                </label>
                <input
                  type="text"
                  required
                  placeholder="Misal: Servis Motor, Pulang Kampung, Gadget Baru"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-500 mb-1">
                  Target Nominal (Rp)
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  placeholder="300000"
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(e.target.value ? Number(e.target.value) : '')}
                  className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-500 mb-1">
                  Tabungan Awal Saat Ini (Rp)
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={initialAmount}
                  onChange={(e) => setInitialAmount(e.target.value ? Number(e.target.value) : '')}
                  className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-500 mb-1">
                  Kategori
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="darurat">Dana Darurat / Sakit</option>
                  <option value="kendaraan">Servis Kendaraan</option>
                  <option value="mudik">Mudik / Pulang Kampung</option>
                  <option value="gadget">Beli Gadget / Aksesoris</option>
                  <option value="lainnya">Lainnya</option>
                </select>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors"
                >
                  Simpan Target Tabungan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
