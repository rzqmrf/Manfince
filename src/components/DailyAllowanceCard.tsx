'use client';

import React from 'react';
import { useFinance } from '@/context/FinanceContext';
import { formatRupiah } from '@/lib/utils';
import { 
  ShieldCheck, 
  AlertTriangle, 
  AlertOctagon, 
  Calendar, 
  Lock, 
  Coins, 
  Coffee, 
  TrendingDown,
  Info
} from 'lucide-react';

interface DailyAllowanceCardProps {
  onOpenFixedCosts: () => void;
  onOpenQuickAdd: () => void;
  onOpenProfile: () => void;
}

export function DailyAllowanceCard({ onOpenFixedCosts, onOpenQuickAdd, onOpenProfile }: DailyAllowanceCardProps) {
  const { 
    profile, 
    daysRemaining, 
    totalUnpaidFixedCost, 
    netSafeBalance, 
    safeDailyAllowance, 
    financialStatus, 
    todayExpenses 
  } = useFinance();

  // Status configuration
  const statusConfig = {
    safe: {
      title: 'Mode Aman (Santai)',
      subtitle: 'Kondisi dompet aman! Kamu masih bisa makan enak atau ngopi.',
      badgeBg: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
      heroBg: 'from-emerald-500/10 via-teal-500/5 to-transparent',
      borderColor: 'border-emerald-200 dark:border-emerald-800/60',
      textColor: 'text-emerald-600 dark:text-emerald-400',
      icon: ShieldCheck,
      kosTip: '💡 Saldo mencukupi! Pertahankan pola pengeluaran ini agar bisa menyisihkan sisa uang ke tabungan.',
    },
    warning: {
      title: 'Mode Waspada',
      subtitle: 'Mulai batasi jajan di luar & nongkrong santai. Utamakan makan warteg & masak.',
      badgeBg: 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border-amber-200 dark:border-amber-800',
      heroBg: 'from-amber-500/10 via-orange-500/5 to-transparent',
      borderColor: 'border-amber-200 dark:border-amber-800/60',
      textColor: 'text-amber-600 dark:text-amber-400',
      icon: AlertTriangle,
      kosTip: '💡 Rem pengeluaran non-primer. Bawa botol minum sendiri saat kuliah atau kerja untuk hemat jajan!',
    },
    critical: {
      title: 'Mode Kritis (Akhir Bulan)',
      subtitle: 'Peringatan krisis! Batasi pengeluaran hanya untuk kebutuhan makan pokok.',
      badgeBg: 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 border-rose-200 dark:border-rose-800',
      heroBg: 'from-rose-500/10 via-red-500/5 to-transparent',
      borderColor: 'border-rose-200 dark:border-rose-800/60',
      textColor: 'text-rose-600 dark:text-rose-400',
      icon: AlertOctagon,
      kosTip: '⚠️ Dana menipis drastis! Masak mie/telur di kosan dan tagih segera teman yang punya utang patungan.',
    },
  }[financialStatus];

  const StatusIcon = statusConfig.icon;
  const remainingTodayAllowance = Math.max(0, safeDailyAllowance - todayExpenses);
  const isOverDailyLimit = todayExpenses > safeDailyAllowance && safeDailyAllowance > 0;

  return (
    <div className={`relative overflow-hidden rounded-2xl sm:rounded-3xl border bg-white dark:bg-zinc-900 ${statusConfig.borderColor} shadow-sm transition-all`}>
      {/* Background Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${statusConfig.heroBg} pointer-events-none`} />

      <div className="relative p-5 sm:p-7">
        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 mb-5">
          {/* Status Badge */}
          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${statusConfig.badgeBg}`}>
            <StatusIcon className="w-4 h-4" />
            <span>{statusConfig.title}</span>
          </div>

          {/* Days Countdown Badge */}
          <button 
            onClick={onOpenProfile}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
          >
            <Calendar className="w-3.5 h-3.5 text-zinc-500" />
            <span>
              Tersisa <strong className="text-zinc-900 dark:text-white">{daysRemaining} hari</strong> (Kiriman tgl {profile.nextPaydayDate})
            </span>
          </button>
        </div>

        {/* Main Hero Number */}
        <div className="mb-6">
          <p className="text-xs sm:text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-1 flex items-center gap-1.5">
            <Coins className="w-4 h-4 text-emerald-500" />
            Batas Jajan Aman Hari Ini (Daily Limit)
          </p>
          <div className="flex items-baseline gap-2">
            <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight ${statusConfig.textColor}`}>
              {formatRupiah(safeDailyAllowance)}
            </h2>
            <span className="text-sm sm:text-base font-semibold text-zinc-400">/ hari</span>
          </div>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-2">
            {statusConfig.subtitle}
          </p>
        </div>

        {/* Today's Expense Bar */}
        <div className="p-3.5 sm:p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700/60 mb-5">
          <div className="flex items-center justify-between text-xs sm:text-sm mb-2">
            <span className="text-zinc-600 dark:text-zinc-300 flex items-center gap-1.5 font-medium">
              <Coffee className="w-4 h-4 text-amber-500" />
              Pengeluaran Hari Ini:
            </span>
            <span className="font-bold text-zinc-900 dark:text-white">
              {formatRupiah(todayExpenses)}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-zinc-200 dark:bg-zinc-700 h-2.5 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                isOverDailyLimit 
                  ? 'bg-rose-500' 
                  : todayExpenses > safeDailyAllowance * 0.7 
                    ? 'bg-amber-500' 
                    : 'bg-emerald-500'
              }`}
              style={{
                width: `${safeDailyAllowance > 0 ? Math.min(100, (todayExpenses / safeDailyAllowance) * 100) : 100}%`,
              }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-zinc-500 dark:text-zinc-400 mt-2">
            <span>
              {isOverDailyLimit ? (
                <span className="text-rose-600 dark:text-rose-400 font-semibold flex items-center gap-1">
                  <TrendingDown className="w-3.5 h-3.5" /> Lewat batas jajan harian sebesar {formatRupiah(todayExpenses - safeDailyAllowance)}
                </span>
              ) : (
                <span>
                  Sisa jajan hari ini: <strong className="text-emerald-600 dark:text-emerald-400">{formatRupiah(remainingTodayAllowance)}</strong>
                </span>
              )}
            </span>
            <button
              onClick={onOpenQuickAdd}
              className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium"
            >
              + Catat jajan
            </button>
          </div>
        </div>

        {/* Breakdown Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Card 1: Saldo Riil */}
          <div 
            onClick={onOpenProfile}
            className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/60 dark:border-zinc-700/40 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer transition-colors"
          >
            <span className="text-[11px] text-zinc-500 dark:text-zinc-400 block mb-0.5">
              Saldo Dompet + Rekening
            </span>
            <span className="text-base font-bold text-zinc-900 dark:text-white">
              {formatRupiah(profile.currentBalance)}
            </span>
          </div>

          {/* Card 2: Uang Dikunci untuk Tagihan */}
          <div 
            onClick={onOpenFixedCosts}
            className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/60 dark:border-zinc-700/40 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-zinc-500 dark:text-zinc-400 block mb-0.5 flex items-center gap-1">
                <Lock className="w-3 h-3 text-rose-500" />
                Tagihan Wajib Belum Bayar
              </span>
            </div>
            <span className="text-base font-bold text-rose-600 dark:text-rose-400">
              - {formatRupiah(totalUnpaidFixedCost)}
            </span>
          </div>

          {/* Card 3: Sisa Dana Bebas */}
          <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/60 dark:border-zinc-700/40">
            <span className="text-[11px] text-zinc-500 dark:text-zinc-400 block mb-0.5">
              Sisa Uang Bebas Bersih
            </span>
            <span className="text-base font-bold text-emerald-600 dark:text-emerald-400">
              {formatRupiah(netSafeBalance)}
            </span>
          </div>
        </div>

        {/* Tip Anak Kos */}
        <div className="mt-4 p-2.5 rounded-lg bg-zinc-100/80 dark:bg-zinc-800/40 text-xs text-zinc-600 dark:text-zinc-400 flex items-start gap-2">
          <Info className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
          <span>{statusConfig.kosTip}</span>
        </div>
      </div>
    </div>
  );
}
