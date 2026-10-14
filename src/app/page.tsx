'use client';

import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { DailyAllowanceCard } from '@/components/DailyAllowanceCard';
import { TransactionsSection } from '@/components/TransactionsSection';
import { FixedCostsSection } from '@/components/FixedCostsSection';
import { SplitBillSection } from '@/components/SplitBillSection';
import { SavingsSection } from '@/components/SavingsSection';
import { QuickAddModal } from '@/components/QuickAddModal';
import { ProfileModal } from '@/components/ProfileModal';
import { BottomNav, NavTab } from '@/components/BottomNav';
import { useFinance } from '@/context/FinanceContext';
import { formatRupiah, formatDateIndo } from '@/lib/utils';
import { 
  LayoutDashboard, 
  ReceiptText, 
  Lock, 
  Users, 
  Target, 
  ArrowRight, 
  CheckCircle2, 
  Circle,
  PlusCircle,
  UtensilsCrossed,
  ShoppingBag,
  Bike,
  Coffee,
  GraduationCap,
  Tag
} from 'lucide-react';

const categoryIcons: Record<string, React.ElementType> = {
  makan: UtensilsCrossed,
  belanja: ShoppingBag,
  transport: Bike,
  nongkrong: Coffee,
  kuliah: GraduationCap,
  lainnya: Tag,
};

export default function Home() {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const { transactions, fixedCosts, splitBills, savings, toggleFixedCostPaid } = useFinance();

  const recentTransactions = transactions.slice(0, 4);
  const unpaidBills = fixedCosts.filter((fc) => !fc.isPaid);

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 pb-20 md:pb-10 transition-colors">
      {/* Sticky Header */}
      <Header
        onOpenQuickAdd={() => setIsQuickAddOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-5 space-y-6">
        {/* Desktop Navigation Tabs */}
        <div className="hidden md:flex items-center gap-2 p-1.5 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xs">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'dashboard'
                ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-xs'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Ringkasan & Jajan</span>
          </button>

          <button
            onClick={() => setActiveTab('transactions')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'transactions'
                ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-xs'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            <ReceiptText className="w-4 h-4" />
            <span>Riwayat Transaksi</span>
          </button>

          <button
            onClick={() => setActiveTab('fixed')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'fixed'
                ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-xs'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>Tagihan Wajib</span>
            {unpaidBills.length > 0 && (
              <span className="w-2 h-2 rounded-full bg-rose-500" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('split')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'split'
                ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-xs'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Patungan Kos</span>
          </button>

          <button
            onClick={() => setActiveTab('savings')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'savings'
                ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-xs'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            <Target className="w-4 h-4" />
            <span>Target Tabungan</span>
          </button>
        </div>

        {/* Tab 1: Dashboard (Ringkasan & Jajan Harian) */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            {/* Hero Card: Daily Allowance Calculator */}
            <DailyAllowanceCard
              onOpenFixedCosts={() => setActiveTab('fixed')}
              onOpenQuickAdd={() => setIsQuickAddOpen(true)}
              onOpenProfile={() => setIsProfileOpen(true)}
            />

            {/* Quick 2-Column Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Box 1: Transaksi Terkini */}
              <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4 sm:p-5 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                    <ReceiptText className="w-4 h-4 text-emerald-500" />
                    Catatan Terkini
                  </h3>
                  <button
                    onClick={() => setActiveTab('transactions')}
                    className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                  >
                    <span>Lihat Semua</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {recentTransactions.length === 0 ? (
                    <div className="py-6 text-center text-xs text-zinc-400">
                      Belum ada transaksi.
                    </div>
                  ) : (
                    recentTransactions.map((tx) => {
                      const Icon = categoryIcons[tx.category] || Tag;
                      const isExpense = tx.type === 'expense';
                      return (
                        <div key={tx.id} className="py-2.5 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                              isExpense ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/40' : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40'
                            }`}>
                              <Icon className="w-3.5 h-3.5" />
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-zinc-800 dark:text-zinc-200 truncate">
                                {tx.title}
                              </p>
                              <span className="text-[10px] text-zinc-400">
                                {formatDateIndo(tx.date)}
                              </span>
                            </div>
                          </div>
                          <span className={`font-bold shrink-0 ${
                            isExpense ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'
                          }`}>
                            {isExpense ? '- ' : '+ '}
                            {formatRupiah(tx.amount)}
                          </span>
                        </div>
                      );
                    })
                  )}
                </div>

                <button
                  onClick={() => setIsQuickAddOpen(true)}
                  className="w-full py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-semibold text-zinc-700 dark:text-zinc-300 transition-colors flex items-center justify-center gap-1.5"
                >
                  <PlusCircle className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Catat Pengeluaran Baru</span>
                </button>
              </div>

              {/* Box 2: Tagihan Wajib yang Belum Dibayar */}
              <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4 sm:p-5 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                    <Lock className="w-4 h-4 text-rose-500" />
                    Tagihan Perlu Dibayar
                  </h3>
                  <button
                    onClick={() => setActiveTab('fixed')}
                    className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                  >
                    <span>Kelola</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {unpaidBills.length === 0 ? (
                    <div className="py-6 text-center text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                      🎉 Mantap! Semua tagihan wajib sudah lunas.
                    </div>
                  ) : (
                    unpaidBills.slice(0, 3).map((item) => (
                      <div key={item.id} className="py-2.5 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <button
                            onClick={() => toggleFixedCostPaid(item.id)}
                            className="text-zinc-400 hover:text-emerald-500 transition-colors shrink-0"
                            title="Tandai sudah dibayar"
                          >
                            <Circle className="w-4 h-4" />
                          </button>
                          <div className="min-w-0">
                            <p className="font-semibold text-zinc-800 dark:text-zinc-200 truncate">
                              {item.name}
                            </p>
                            <span className="text-[10px] text-zinc-400">
                              Jatuh tempo: tgl {item.dueDate}
                            </span>
                          </div>
                        </div>
                        <span className="font-bold text-zinc-900 dark:text-white shrink-0">
                          {formatRupiah(item.amount)}
                        </span>
                      </div>
                    ))
                  )}
                </div>

                <div className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 text-[11px] text-zinc-500 flex items-center justify-between">
                  <span>Centang jika sudah kamu transfer</span>
                  <button
                    onClick={() => setActiveTab('fixed')}
                    className="text-emerald-600 dark:text-emerald-400 font-medium hover:underline"
                  >
                    Detail Tagihan
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Transactions */}
        {activeTab === 'transactions' && (
          <div className="animate-in fade-in duration-150">
            <TransactionsSection onOpenQuickAdd={() => setIsQuickAddOpen(true)} />
          </div>
        )}

        {/* Tab 3: Fixed Costs */}
        {activeTab === 'fixed' && (
          <div className="animate-in fade-in duration-150">
            <FixedCostsSection />
          </div>
        )}

        {/* Tab 4: Split Bill */}
        {activeTab === 'split' && (
          <div className="animate-in fade-in duration-150">
            <SplitBillSection />
          </div>
        )}

        {/* Tab 5: Savings */}
        {activeTab === 'savings' && (
          <div className="animate-in fade-in duration-150">
            <SavingsSection />
          </div>
        )}
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <BottomNav activeTab={activeTab} onTabChange={(tab) => setActiveTab(tab)} />

      {/* Modals */}
      <QuickAddModal
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
      />

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />
    </div>
  );
}
