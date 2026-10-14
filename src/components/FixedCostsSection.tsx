'use client';

import React, { useState } from 'react';
import { useFinance } from '@/context/FinanceContext';
import { formatRupiah } from '@/lib/utils';
import { FixedCostCategory } from '@/types/finance';
import { 
  Home, 
  Zap, 
  Wifi, 
  Shirt, 
  Droplet, 
  Tag, 
  CheckCircle2, 
  Circle, 
  Plus, 
  Trash2, 
  Lock, 
  X,
  AlertCircle 
} from 'lucide-react';

const fixedCostIcons: Record<FixedCostCategory, React.ElementType> = {
  kos: Home,
  listrik: Zap,
  internet: Wifi,
  laundry: Shirt,
  air_gas: Droplet,
  lainnya: Tag,
};

export function FixedCostsSection() {
  const { fixedCosts, toggleFixedCostPaid, deleteFixedCost, addFixedCost } = useFinance();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [amount, setAmount] = useState<number | ''>('');
  const [dueDate, setDueDate] = useState<number>(5);
  const [category, setCategory] = useState<FixedCostCategory>('kos');
  const [note, setNote] = useState('');

  const totalFixedCosts = fixedCosts.reduce((sum, fc) => sum + fc.amount, 0);
  const paidFixedCosts = fixedCosts.filter((fc) => fc.isPaid).reduce((sum, fc) => sum + fc.amount, 0);
  const unpaidFixedCosts = fixedCosts.filter((fc) => !fc.isPaid).reduce((sum, fc) => sum + fc.amount, 0);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !amount || Number(amount) <= 0) return;

    addFixedCost({
      name: name.trim(),
      amount: Number(amount),
      dueDate: Number(dueDate),
      category,
      isPaid: false,
      note: note.trim() || undefined,
    });

    // Reset & close
    setName('');
    setAmount('');
    setNote('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-4">
      {/* Summary Banner */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4 sm:p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-rose-500" />
              Pos Tagihan Wajib (Fixed Costs)
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Uang yang harus disisihkan untuk kewajiban kos & tidak boleh dipakai jajan
            </p>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1 self-start sm:self-auto transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Pos Tagihan</span>
          </button>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-700/60">
            <span className="text-[11px] text-zinc-500 dark:text-zinc-400 block mb-0.5">
              Total Kewajiban
            </span>
            <span className="text-sm sm:text-base font-bold text-zinc-900 dark:text-white">
              {formatRupiah(totalFixedCosts)}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30">
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 block mb-0.5">
              Sudah Lunas
            </span>
            <span className="text-sm sm:text-base font-bold text-emerald-700 dark:text-emerald-300">
              {formatRupiah(paidFixedCosts)}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30">
            <span className="text-[11px] text-rose-600 dark:text-rose-400 block mb-0.5">
              Masih Harus Dibayar
            </span>
            <span className="text-sm sm:text-base font-bold text-rose-700 dark:text-rose-300">
              {formatRupiah(unpaidFixedCosts)}
            </span>
          </div>
        </div>
      </div>

      {/* List of Fixed Costs */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4 sm:p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between text-xs text-zinc-500 font-medium pb-2 border-b border-zinc-100 dark:border-zinc-800">
          <span>Daftar Tagihan</span>
          <span>Centang jika sudah dibayar</span>
        </div>

        <div className="space-y-2">
          {fixedCosts.map((item) => {
            const Icon = fixedCostIcons[item.category] || Tag;
            return (
              <div
                key={item.id}
                className={`p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                  item.isPaid
                    ? 'bg-zinc-50/50 dark:bg-zinc-800/20 border-zinc-200/60 dark:border-zinc-800/60 opacity-75'
                    : 'bg-white dark:bg-zinc-800/60 border-zinc-200 dark:border-zinc-700/80 shadow-xs'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Toggle Paid Button */}
                  <button
                    onClick={() => toggleFixedCostPaid(item.id)}
                    className="shrink-0 text-zinc-400 hover:text-emerald-600 transition-colors"
                    title={item.isPaid ? 'Tandai belum bayar' : 'Tandai sudah lunas'}
                  >
                    {item.isPaid ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-100 dark:fill-emerald-950" />
                    ) : (
                      <Circle className="w-5 h-5 text-zinc-400 hover:text-emerald-500" />
                    )}
                  </button>

                  <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-700 flex items-center justify-center shrink-0 text-zinc-700 dark:text-zinc-300">
                    <Icon className="w-4 h-4" />
                  </div>

                  <div className="min-w-0">
                    <p
                      className={`text-xs sm:text-sm font-semibold truncate ${
                        item.isPaid
                          ? 'line-through text-zinc-400 dark:text-zinc-500'
                          : 'text-zinc-900 dark:text-white'
                      }`}
                    >
                      {item.name}
                    </p>
                    <div className="flex items-center gap-2 text-[11px] text-zinc-400">
                      <span>Jatuh tempo: tgl {item.dueDate}</span>
                      {item.note && <span>• {item.note}</span>}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <span
                      className={`text-xs sm:text-sm font-bold block ${
                        item.isPaid
                          ? 'text-zinc-400 dark:text-zinc-500'
                          : 'text-zinc-900 dark:text-white'
                      }`}
                    >
                      {formatRupiah(item.amount)}
                    </span>
                    <span
                      className={`text-[10px] font-semibold px-1.5 py-0.2 rounded ${
                        item.isPaid
                          ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400'
                          : 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400'
                      }`}
                    >
                      {item.isPaid ? 'Lunas' : 'Belum Bayar'}
                    </span>
                  </div>

                  <button
                    onClick={() => deleteFixedCost(item.id)}
                    className="p-1 rounded-lg text-zinc-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                    title="Hapus tagihan"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Info Box */}
        <div className="mt-4 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
          <span>
            Setiap kali Anda menandai tagihan sebagai <strong>Lunas</strong>, dana yang dikunci akan otomatis diperbarui dan batas jajan harian Anda akan disesuaikan.
          </span>
        </div>
      </div>

      {/* Modal Tambah Tagihan Wajib */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 p-6 overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800 mb-4">
              <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                Tambah Pos Tagihan Wajib
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
                  Nama Tagihan
                </label>
                <input
                  type="text"
                  required
                  placeholder="Misal: Uang Kosan, Token Listrik, WiFi"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-500 mb-1">
                  Nominal (Rp)
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  placeholder="500000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value ? Number(e.target.value) : '')}
                  className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-500 mb-1">
                    Kategori
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as FixedCostCategory)}
                    className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="kos">Kamar Kos</option>
                    <option value="listrik">Listrik / Token</option>
                    <option value="internet">WiFi / Kuota</option>
                    <option value="laundry">Laundry</option>
                    <option value="air_gas">Air & Gas</option>
                    <option value="lainnya">Lainnya</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-500 mb-1">
                    Jatuh Tempo (Tgl 1-31)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="31"
                    value={dueDate}
                    onChange={(e) => setDueDate(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-500 mb-1">
                  Catatan Tambahan (Opsional)
                </label>
                <input
                  type="text"
                  placeholder="Misal: Bayar ke Ibu Kos lewat BCA"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors"
                >
                  Simpan Tagihan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
