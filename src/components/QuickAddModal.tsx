'use client';

import React, { useState } from 'react';
import { useFinance } from '@/context/FinanceContext';
import { ExpenseCategory, IncomeCategory } from '@/types/finance';
import { 
  X, 
  UtensilsCrossed, 
  ShoppingBag, 
  Bike, 
  Coffee, 
  GraduationCap, 
  HeartPulse, 
  Tag, 
  Home, 
  Briefcase, 
  Laptop, 
  Award, 
  Check 
} from 'lucide-react';

interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const expenseCategories: Array<{ id: ExpenseCategory; label: string; icon: React.ElementType; color: string }> = [
  { id: 'makan', label: 'Makan & Warteg', icon: UtensilsCrossed, color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/40 border-amber-200' },
  { id: 'belanja', label: 'Belanja Kos', icon: ShoppingBag, color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/40 border-blue-200' },
  { id: 'transport', label: 'Bensin & Ojol', icon: Bike, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200' },
  { id: 'nongkrong', label: 'Kopi / Nongkrong', icon: Coffee, color: 'text-orange-500 bg-orange-50 dark:bg-orange-950/40 border-orange-200' },
  { id: 'kuliah', label: 'Kuliah & Print', icon: GraduationCap, color: 'text-purple-500 bg-purple-50 dark:bg-purple-950/40 border-purple-200' },
  { id: 'kesehatan', label: 'Obat & Vitamin', icon: HeartPulse, color: 'text-rose-500 bg-rose-50 dark:bg-rose-950/40 border-rose-200' },
  { id: 'lainnya', label: 'Lain-lain', icon: Tag, color: 'text-zinc-500 bg-zinc-50 dark:bg-zinc-800 border-zinc-200' },
];

const incomeCategories: Array<{ id: IncomeCategory; label: string; icon: React.ElementType; color: string }> = [
  { id: 'kiriman', label: 'Kiriman Ortu', icon: Home, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200' },
  { id: 'gaji', label: 'Gaji / Upah', icon: Briefcase, color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/40 border-blue-200' },
  { id: 'freelance', label: 'Side Job / Freelance', icon: Laptop, color: 'text-purple-500 bg-purple-50 dark:bg-purple-950/40 border-purple-200' },
  { id: 'beasiswa', label: 'Beasiswa', icon: Award, color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/40 border-amber-200' },
  { id: 'lainnya', label: 'Pemasukan Lain', icon: Tag, color: 'text-zinc-500 bg-zinc-50 dark:bg-zinc-800 border-zinc-200' },
];

const quickPresets = [10000, 15000, 20000, 25000, 50000, 100000];

export function QuickAddModal({ isOpen, onClose }: QuickAddModalProps) {
  const { addTransaction } = useFinance();
  const [type, setType] = useState<'expense' | 'income'>('expense');
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState<number | ''>('');
  const [category, setCategory] = useState<string>('makan');
  const [date, setDate] = useState<string>('2026-10-14');

  React.useEffect(() => {
    if (isOpen) {
      setDate(new Date().toISOString().split('T')[0]);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) return;

    const finalTitle = title.trim() || (type === 'expense' ? 'Pengeluaran Tanpa Judul' : 'Pemasukan');

    addTransaction({
      title: finalTitle,
      amount: Number(amount),
      type,
      category: category as ExpenseCategory | IncomeCategory,
      date,
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    });

    // Reset form & close
    setTitle('');
    setAmount('');
    onClose();
  };

  const handleQuickAddAmount = (val: number) => {
    setAmount((prev) => (Number(prev) || 0) + val);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-3">
          <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
            Catat Transaksi Baru
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Pengeluaran vs Pemasukan */}
        <div className="px-6 mb-4">
          <div className="grid grid-cols-2 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-2xl">
            <button
              type="button"
              onClick={() => {
                setType('expense');
                setCategory('makan');
              }}
              className={`py-2 text-xs font-semibold rounded-xl transition-all ${
                type === 'expense'
                  ? 'bg-white dark:bg-zinc-700 text-rose-600 dark:text-rose-400 shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
              }`}
            >
              💸 Pengeluaran
            </button>
            <button
              type="button"
              onClick={() => {
                setType('income');
                setCategory('kiriman');
              }}
              className={`py-2 text-xs font-semibold rounded-xl transition-all ${
                type === 'income'
                  ? 'bg-white dark:bg-zinc-700 text-emerald-600 dark:text-emerald-400 shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
              }`}
            >
              💰 Pemasukan / Kiriman
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-4">
          {/* Input Nominal */}
          <div>
            <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">
              Nominal (Rp)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-zinc-400">
                Rp
              </span>
              <input
                type="number"
                required
                min="1"
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value ? Number(e.target.value) : '')}
                className="w-full pl-12 pr-4 py-3 bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 rounded-2xl text-xl font-bold text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                autoFocus
              />
            </div>

            {/* Quick Amount Chips */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {quickPresets.map((val) => (
                <button
                  type="button"
                  key={val}
                  onClick={() => handleQuickAddAmount(val)}
                  className="px-2.5 py-1 text-[11px] font-medium bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-lg transition-colors"
                >
                  +{val >= 1000 ? `${val / 1000}rb` : val}
                </button>
              ))}
              {amount !== '' && (
                <button
                  type="button"
                  onClick={() => setAmount('')}
                  className="px-2 py-1 text-[11px] font-medium text-rose-500 hover:underline"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Input Judul Transaksi */}
          <div>
            <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">
              Keterangan / Nama Keperluan
            </label>
            <input
              type="text"
              placeholder={type === 'expense' ? 'Misal: Nasi Padang + Es Teh, Bensin' : 'Misal: Kiriman Bulanan, Gaji'}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Pilihan Kategori */}
          <div>
            <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-2">
              Pilih Kategori
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {(type === 'expense' ? expenseCategories : incomeCategories).map((cat) => {
                const Icon = cat.icon;
                const isSelected = category === cat.id;
                return (
                  <button
                    type="button"
                    key={cat.id}
                    onClick={() => setCategory(cat.id)}
                    className={`flex items-center gap-2 p-2 rounded-xl text-xs font-medium border text-left transition-all ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 ring-2 ring-emerald-500/30'
                        : 'border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800/40 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tanggal */}
          <div>
            <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">
              Tanggal
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Tombol Simpan */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm shadow-md shadow-emerald-600/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              Simpan Transaksi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
