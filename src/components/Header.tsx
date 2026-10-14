'use client';

import React from 'react';
import { useFinance } from '@/context/FinanceContext';
import { formatRupiah } from '@/lib/utils';
import { Wallet, Settings, RotateCcw, Plus, Sparkles } from 'lucide-react';

interface HeaderProps {
  onOpenQuickAdd: () => void;
  onOpenProfile: () => void;
}

export function Header({ onOpenQuickAdd, onOpenProfile }: HeaderProps) {
  const { profile, resetToDefault } = useFinance();

  const handleReset = () => {
    if (window.confirm('Apakah kamu yakin ingin mereset semua data simulasi ke setelan awal?')) {
      resetToDefault();
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 transition-colors">
      <div className="max-w-4xl mx-auto px-4 py-3 sm:py-4 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-white">
                Manfince
              </h1>
              <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 rounded-md">
                Anak Kos
              </span>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Halo, <span className="font-medium text-zinc-700 dark:text-zinc-200">{profile.name}</span> 👋
            </p>
          </div>
        </div>

        {/* Quick Balance & Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Balance Pill Button */}
          <button
            onClick={onOpenProfile}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all text-xs font-medium text-zinc-700 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700"
            title="Klik untuk ubah saldo & profil"
          >
            <Wallet className="w-3.5 h-3.5 text-emerald-500" />
            <span>Saldo:</span>
            <span className="font-semibold text-zinc-900 dark:text-white">
              {formatRupiah(profile.currentBalance)}
            </span>
          </button>

          {/* Quick Add Button */}
          <button
            onClick={onOpenQuickAdd}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden xs:inline">Catat Pengeluaran</span>
            <span className="xs:hidden">Catat</span>
          </button>

          {/* Settings / Profile Button */}
          <button
            onClick={onOpenProfile}
            className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400 transition-colors"
            title="Pengaturan Profil & Siklus Kiriman"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Reset Button */}
          <button
            onClick={handleReset}
            className="p-2 rounded-full hover:bg-rose-50 dark:hover:bg-rose-950/40 text-zinc-400 hover:text-rose-500 transition-colors"
            title="Reset ke data awal"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
}
