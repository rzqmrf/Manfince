'use client';

import React, { useState } from 'react';
import { useFinance } from '@/context/FinanceContext';
import { formatRupiah, formatDateIndo } from '@/lib/utils';
import { 
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
  Search, 
  Trash2, 
  TrendingUp, 
  TrendingDown,
  Plus
} from 'lucide-react';

interface TransactionsSectionProps {
  onOpenQuickAdd: () => void;
}

const categoryIcons: Record<string, React.ElementType> = {
  makan: UtensilsCrossed,
  belanja: ShoppingBag,
  transport: Bike,
  nongkrong: Coffee,
  kuliah: GraduationCap,
  kesehatan: HeartPulse,
  kiriman: Home,
  gaji: Briefcase,
  freelance: Laptop,
  beasiswa: Award,
  lainnya: Tag,
};

const filterTabs = [
  { id: 'all', label: 'Semua' },
  { id: 'makan', label: 'Makan' },
  { id: 'belanja', label: 'Belanja' },
  { id: 'nongkrong', label: 'Nongkrong' },
  { id: 'transport', label: 'Transport' },
  { id: 'kuliah', label: 'Kuliah' },
  { id: 'income', label: 'Pemasukan' },
];

export function TransactionsSection({ onOpenQuickAdd }: TransactionsSectionProps) {
  const { transactions, deleteTransaction, monthIncome, monthExpenses } = useFinance();
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const filteredTransactions = transactions.filter((tx) => {
    // Search match
    const matchSearch = tx.title.toLowerCase().includes(search.toLowerCase());
    if (!matchSearch) return false;

    // Tab match
    if (activeTab === 'all') return true;
    if (activeTab === 'income') return tx.type === 'income';
    return tx.category === activeTab;
  });

  return (
    <div className="space-y-4">
      {/* Month Income vs Expense Banner */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3.5 sm:p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-medium mb-1">
            <TrendingUp className="w-4 h-4" />
            <span>Pemasukan Bulan Ini</span>
          </div>
          <span className="text-base sm:text-xl font-bold text-emerald-700 dark:text-emerald-300">
            {formatRupiah(monthIncome)}
          </span>
        </div>

        <div className="p-3.5 sm:p-4 rounded-2xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/40">
          <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 text-xs font-medium mb-1">
            <TrendingDown className="w-4 h-4" />
            <span>Pengeluaran Bulan Ini</span>
          </div>
          <span className="text-base sm:text-xl font-bold text-rose-700 dark:text-rose-300">
            {formatRupiah(monthExpenses)}
          </span>
        </div>
      </div>

      {/* Header and Filter Controls */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4 sm:p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-white">
              Riwayat Transaksi
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Catatan uang masuk & keluar harian
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-56">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder="Cari transaksi..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <button
              onClick={onOpenQuickAdd}
              className="p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Tambah</span>
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Transactions List */}
        <div className="divide-y divide-zinc-100 dark:divide-zinc-800/80">
          {filteredTransactions.length === 0 ? (
            <div className="py-12 text-center text-zinc-400 text-xs">
              Belum ada catatan transaksi yang sesuai.
            </div>
          ) : (
            filteredTransactions.map((tx) => {
              const Icon = categoryIcons[tx.category] || Tag;
              const isExpense = tx.type === 'expense';

              return (
                <div
                  key={tx.id}
                  className="py-3 flex items-center justify-between gap-3 group hover:bg-zinc-50/60 dark:hover:bg-zinc-800/30 px-2 rounded-xl transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        isExpense
                          ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400'
                          : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-semibold text-zinc-900 dark:text-white truncate">
                        {tx.title}
                      </p>
                      <div className="flex items-center gap-2 text-[11px] text-zinc-400">
                        <span>{formatDateIndo(tx.date)}</span>
                        {tx.time && <span>• {tx.time}</span>}
                        <span className="capitalize px-1.5 py-0.2 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-500 text-[10px]">
                          {tx.category}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0">
                    <span
                      className={`text-xs sm:text-sm font-bold ${
                        isExpense
                          ? 'text-rose-600 dark:text-rose-400'
                          : 'text-emerald-600 dark:text-emerald-400'
                      }`}
                    >
                      {isExpense ? '- ' : '+ '}
                      {formatRupiah(tx.amount)}
                    </span>

                    <button
                      onClick={() => deleteTransaction(tx.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded-lg text-zinc-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-all"
                      title="Hapus transaksi"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
