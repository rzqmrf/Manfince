'use client';

import React, { useState, useEffect } from 'react';
import { useFinance } from '@/context/FinanceContext';
import { X, Check, User, Wallet, Calendar, ShieldAlert } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const { profile, updateProfile } = useFinance();

  const [name, setName] = useState(profile.name);
  const [currentBalance, setCurrentBalance] = useState<number | ''>(profile.currentBalance);
  const [monthlyAllowance, setMonthlyAllowance] = useState<number | ''>(profile.monthlyAllowance);
  const [nextPaydayDate, setNextPaydayDate] = useState<number>(profile.nextPaydayDate);
  const [minimumDailyTarget, setMinimumDailyTarget] = useState<number | ''>(profile.minimumDailyTarget);

  useEffect(() => {
    if (isOpen) {
      setName(profile.name);
      setCurrentBalance(profile.currentBalance);
      setMonthlyAllowance(profile.monthlyAllowance);
      setNextPaydayDate(profile.nextPaydayDate);
      setMinimumDailyTarget(profile.minimumDailyTarget);
    }
  }, [isOpen, profile]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: name.trim() || 'Anak Kos',
      currentBalance: Number(currentBalance) || 0,
      monthlyAllowance: Number(monthlyAllowance) || 0,
      nextPaydayDate: Number(nextPaydayDate) || 1,
      minimumDailyTarget: Number(minimumDailyTarget) || 30000,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 p-6 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800 mb-4">
          <div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-white">
              Pengaturan Siklus Keuangan Kos
            </h3>
            <p className="text-xs text-zinc-500">
              Sesuaikan saldo riil & tanggal kiriman bulanan
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nama */}
          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-1 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-zinc-400" />
              Nama / Panggilan Kamu
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Saldo Saat Ini */}
          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-1 flex items-center gap-1.5">
              <Wallet className="w-3.5 h-3.5 text-emerald-500" />
              Saldo Nyata Saat Ini (Dompet + Bank/E-Wallet)
            </label>
            <input
              type="number"
              required
              min="0"
              value={currentBalance}
              onChange={(e) => setCurrentBalance(e.target.value ? Number(e.target.value) : '')}
              className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs text-zinc-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Tanggal Kiriman / Gajian */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-zinc-500 mb-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-blue-500" />
                Tanggal Kiriman Ortu
              </label>
              <input
                type="number"
                required
                min="1"
                max="31"
                placeholder="1"
                value={nextPaydayDate}
                onChange={(e) => setNextPaydayDate(Number(e.target.value))}
                className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <span className="text-[10px] text-zinc-400 mt-0.5 block">
                Tgl dalam bulan (1-31)
              </span>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-500 mb-1 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
                Target Minimal Harian
              </label>
              <input
                type="number"
                required
                min="5000"
                step="5000"
                value={minimumDailyTarget}
                onChange={(e) => setMinimumDailyTarget(e.target.value ? Number(e.target.value) : '')}
                className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <span className="text-[10px] text-zinc-400 mt-0.5 block">
                Batas waspada (Rp)
              </span>
            </div>
          </div>

          {/* Rata-rata Kiriman Bulanan */}
          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-1">
              Estimasi Kiriman / Uang Saku per Bulan (Rp)
            </label>
            <input
              type="number"
              min="0"
              value={monthlyAllowance}
              onChange={(e) => setMonthlyAllowance(e.target.value ? Number(e.target.value) : '')}
              className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <Check className="w-4 h-4" />
              Simpan Pengaturan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
