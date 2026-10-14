'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Transaction, 
  FixedCost, 
  SplitBill, 
  SavingGoal, 
  UserProfile 
} from '@/types/finance';

interface FinanceContextType {
  profile: UserProfile;
  transactions: Transaction[];
  fixedCosts: FixedCost[];
  splitBills: SplitBill[];
  savings: SavingGoal[];
  isLoaded: boolean;
  
  // Perhitungan Keuangan
  daysRemaining: number;
  totalUnpaidFixedCost: number;
  netSafeBalance: number;
  safeDailyAllowance: number;
  financialStatus: 'safe' | 'warning' | 'critical';
  todayExpenses: number;
  monthExpenses: number;
  monthIncome: number;

  // Actions
  updateProfile: (profile: Partial<UserProfile>) => void;
  addTransaction: (tx: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  addFixedCost: (cost: Omit<FixedCost, 'id'>) => void;
  toggleFixedCostPaid: (id: string) => void;
  deleteFixedCost: (id: string) => void;
  addSplitBill: (bill: Omit<SplitBill, 'id'>) => void;
  toggleSplitMemberSettled: (billId: string, memberId: string) => void;
  deleteSplitBill: (id: string) => void;
  addSavingGoal: (goal: Omit<SavingGoal, 'id'>) => void;
  updateSavingProgress: (id: string, amountToAdd: number) => void;
  deleteSavingGoal: (id: string) => void;
  resetToDefault: () => void;
}

const defaultProfile: UserProfile = {
  name: 'Anak Kos Teladan',
  currentBalance: 780000,
  monthlyAllowance: 2000000,
  nextPaydayDate: 1, // Tiap tanggal 1 awal bulan
  minimumDailyTarget: 30000, // Rp 30.000/hari
};

const defaultFixedCosts: FixedCost[] = [
  { id: 'fc-1', name: 'Sewa Kamar Kos', amount: 550000, dueDate: 5, isPaid: true, category: 'kos' },
  { id: 'fc-2', name: 'Token Listrik Kos', amount: 50000, dueDate: 20, isPaid: false, category: 'listrik', note: 'Beli via minimarket' },
  { id: 'fc-3', name: 'Iuran WiFi & Sampah', amount: 35000, dueDate: 25, isPaid: false, category: 'internet' },
  { id: 'fc-4', name: 'Estimasi Laundry Kiloan', amount: 45000, dueDate: 18, isPaid: false, category: 'laundry' },
];

const defaultTransactions: Transaction[] = [
  { id: 'tx-1', title: 'Kiriman Uang Ortu', amount: 2000000, type: 'income', category: 'kiriman', date: '2026-10-14', time: '08:30' },
  { id: 'tx-2', title: 'Bayar Uang Kos Bulanan', amount: 550000, type: 'expense', category: 'belanja', date: '2026-10-14', time: '09:00' },
  { id: 'tx-3', title: 'Makan Warteg Siang (Ayam + Es Teh)', amount: 18000, type: 'expense', category: 'makan', date: '2026-10-14', time: '12:15' },
  { id: 'tx-4', title: 'Print & Fotokopi Makalah', amount: 8000, type: 'expense', category: 'kuliah', date: '2026-10-14', time: '14:20' },
  { id: 'tx-5', title: 'Bensin Motor Beat', amount: 25000, type: 'expense', category: 'transport', date: '2026-10-14', time: '16:00' },
];

const defaultSplitBills: SplitBill[] = [
  {
    id: 'sb-1',
    title: 'Beli Galon Aqua & Gas Kosan',
    totalAmount: 46000,
    paidBy: 'Saya',
    date: '2026-10-14',
    members: [
      { id: 'm-1', name: 'Rian (Kamar 02)', shareAmount: 15000, isSettled: true },
      { id: 'm-2', name: 'Dimas (Kamar 05)', shareAmount: 15000, isSettled: false },
    ],
  },
  {
    id: 'sb-2',
    title: 'Makan Bareng Mie Gacoan',
    totalAmount: 64000,
    paidBy: 'Saya',
    date: '2026-10-14',
    members: [
      { id: 'm-3', name: 'Fikri (Teman Kampus)', shareAmount: 32000, isSettled: false },
    ],
  },
];

const defaultSavings: SavingGoal[] = [
  { id: 'sg-1', name: 'Dana Darurat / Sakit', targetAmount: 500000, currentAmount: 250000, category: 'darurat' },
  { id: 'sg-2', name: 'Servis Motor & Ganti Oli', targetAmount: 150000, currentAmount: 85000, category: 'kendaraan' },
  { id: 'sg-3', name: 'Ongkos Pulang Kampung / Mudik', targetAmount: 400000, currentAmount: 120000, category: 'mudik' },
];

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export function FinanceProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [transactions, setTransactions] = useState<Transaction[]>(defaultTransactions);
  const [fixedCosts, setFixedCosts] = useState<FixedCost[]>(defaultFixedCosts);
  const [splitBills, setSplitBills] = useState<SplitBill[]>(defaultSplitBills);
  const [savings, setSavings] = useState<SavingGoal[]>(defaultSavings);
  const [isLoaded, setIsLoaded] = useState(false);

  // Tanggal yang dievaluasi dalam useEffect agar aman dari prerender SSR Next.js 16
  const [daysRemaining, setDaysRemaining] = useState<number>(15);
  const [todayDateStr, setTodayDateStr] = useState<string>('2026-10-14');
  const [activeMonth, setActiveMonth] = useState<number>(9);
  const [activeYear, setActiveYear] = useState<number>(2026);

  // Load from localStorage on mount & calculate dates
  useEffect(() => {
    try {
      const storedProfile = localStorage.getItem('manfince_profile');
      const storedTx = localStorage.getItem('manfince_transactions');
      const storedFC = localStorage.getItem('manfince_fixed_costs');
      const storedSB = localStorage.getItem('manfince_split_bills');
      const storedSavings = localStorage.getItem('manfince_savings');

      if (storedProfile) setProfile(JSON.parse(storedProfile));
      if (storedTx) setTransactions(JSON.parse(storedTx));
      if (storedFC) setFixedCosts(JSON.parse(storedFC));
      if (storedSB) setSplitBills(JSON.parse(storedSB));
      if (storedSavings) setSavings(JSON.parse(storedSavings));
    } catch (e) {
      console.error('Gagal memuat data dari localStorage', e);
    } finally {
      setIsLoaded(true);
    }

    // Hitung tanggal dinamis pada client side
    const today = new Date();
    const currentDay = today.getDate();
    const payday = profile.nextPaydayDate || 1;

    let targetDate = new Date(today.getFullYear(), today.getMonth(), payday);
    if (payday <= currentDay) {
      targetDate = new Date(today.getFullYear(), today.getMonth() + 1, payday);
    }

    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    setDaysRemaining(Math.max(1, diffDays));
    setTodayDateStr(today.toISOString().split('T')[0]);
    setActiveMonth(today.getMonth());
    setActiveYear(today.getFullYear());
  }, [profile.nextPaydayDate]);

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem('manfince_profile', JSON.stringify(profile));
      localStorage.setItem('manfince_transactions', JSON.stringify(transactions));
      localStorage.setItem('manfince_fixed_costs', JSON.stringify(fixedCosts));
      localStorage.setItem('manfince_split_bills', JSON.stringify(splitBills));
      localStorage.setItem('manfince_savings', JSON.stringify(savings));
    } catch (e) {
      console.error('Gagal menyimpan data ke localStorage', e);
    }
  }, [profile, transactions, fixedCosts, splitBills, savings, isLoaded]);

  // Total tagihan wajib yang belum dibayar
  const totalUnpaidFixedCost = fixedCosts
    .filter((fc) => !fc.isPaid)
    .reduce((sum, fc) => sum + fc.amount, 0);

  // Sisa dana bersih yang bebas digunakan
  const netSafeBalance = Math.max(0, profile.currentBalance - totalUnpaidFixedCost);

  // Batas jajan harian aman
  const safeDailyAllowance = Math.floor(netSafeBalance / Math.max(1, daysRemaining));

  // Indikator status keuangan
  let financialStatus: 'safe' | 'warning' | 'critical' = 'safe';
  const minTarget = profile.minimumDailyTarget || 30000;
  if (safeDailyAllowance < minTarget * 0.75) {
    financialStatus = 'critical';
  } else if (safeDailyAllowance < minTarget * 1.3) {
    financialStatus = 'warning';
  } else {
    financialStatus = 'safe';
  }

  // Pengeluaran hari ini
  const todayExpenses = transactions
    .filter((tx) => tx.type === 'expense' && tx.date === todayDateStr)
    .reduce((sum, tx) => sum + tx.amount, 0);

  // Total pengeluaran bulan ini
  const monthExpenses = transactions
    .filter((tx) => {
      const d = new Date(tx.date);
      return tx.type === 'expense' && d.getMonth() === activeMonth && d.getFullYear() === activeYear;
    })
    .reduce((sum, tx) => sum + tx.amount, 0);

  // Total pemasukan bulan ini
  const monthIncome = transactions
    .filter((tx) => {
      const d = new Date(tx.date);
      return tx.type === 'income' && d.getMonth() === activeMonth && d.getFullYear() === activeYear;
    })
    .reduce((sum, tx) => sum + tx.amount, 0);

  // Action methods
  const updateProfile = (newProfile: Partial<UserProfile>) => {
    setProfile((prev) => ({ ...prev, ...newProfile }));
  };

  const addTransaction = (tx: Omit<Transaction, 'id'>) => {
    const newTx: Transaction = {
      ...tx,
      id: 'tx-' + Date.now(),
      time: tx.time || new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    };

    setTransactions((prev) => [newTx, ...prev]);

    // Update current balance otomatis
    setProfile((prev) => ({
      ...prev,
      currentBalance: tx.type === 'expense' 
        ? Math.max(0, prev.currentBalance - tx.amount)
        : prev.currentBalance + tx.amount,
    }));
  };

  const deleteTransaction = (id: string) => {
    const tx = transactions.find((t) => t.id === id);
    if (!tx) return;

    // Rollback saldo
    setProfile((prev) => ({
      ...prev,
      currentBalance: tx.type === 'expense'
        ? prev.currentBalance + tx.amount
        : Math.max(0, prev.currentBalance - tx.amount),
    }));

    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const addFixedCost = (cost: Omit<FixedCost, 'id'>) => {
    const newCost: FixedCost = {
      ...cost,
      id: 'fc-' + Date.now(),
    };
    setFixedCosts((prev) => [...prev, newCost]);
  };

  const toggleFixedCostPaid = (id: string) => {
    setFixedCosts((prev) =>
      prev.map((fc) => (fc.id === id ? { ...fc, isPaid: !fc.isPaid } : fc))
    );
  };

  const deleteFixedCost = (id: string) => {
    setFixedCosts((prev) => prev.filter((fc) => fc.id !== id));
  };

  const addSplitBill = (bill: Omit<SplitBill, 'id'>) => {
    const newBill: SplitBill = {
      ...bill,
      id: 'sb-' + Date.now(),
    };
    setSplitBills((prev) => [newBill, ...prev]);
  };

  const toggleSplitMemberSettled = (billId: string, memberId: string) => {
    setSplitBills((prev) =>
      prev.map((bill) => {
        if (bill.id !== billId) return bill;
        return {
          ...bill,
          members: bill.members.map((m) =>
            m.id === memberId ? { ...m, isSettled: !m.isSettled } : m
          ),
        };
      })
    );
  };

  const deleteSplitBill = (id: string) => {
    setSplitBills((prev) => prev.filter((b) => b.id !== id));
  };

  const addSavingGoal = (goal: Omit<SavingGoal, 'id'>) => {
    const newGoal: SavingGoal = {
      ...goal,
      id: 'sg-' + Date.now(),
    };
    setSavings((prev) => [...prev, newGoal]);
  };

  const updateSavingProgress = (id: string, amountToAdd: number) => {
    setSavings((prev) =>
      prev.map((g) => {
        if (g.id !== id) return g;
        return { ...g, currentAmount: Math.max(0, g.currentAmount + amountToAdd) };
      })
    );
  };

  const deleteSavingGoal = (id: string) => {
    setSavings((prev) => prev.filter((g) => g.id !== id));
  };

  const resetToDefault = () => {
    setProfile(defaultProfile);
    setTransactions(defaultTransactions);
    setFixedCosts(defaultFixedCosts);
    setSplitBills(defaultSplitBills);
    setSavings(defaultSavings);
    localStorage.clear();
  };

  return (
    <FinanceContext.Provider
      value={{
        profile,
        transactions,
        fixedCosts,
        splitBills,
        savings,
        isLoaded,
        daysRemaining,
        totalUnpaidFixedCost,
        netSafeBalance,
        safeDailyAllowance,
        financialStatus,
        todayExpenses,
        monthExpenses,
        monthIncome,
        updateProfile,
        addTransaction,
        deleteTransaction,
        addFixedCost,
        toggleFixedCostPaid,
        deleteFixedCost,
        addSplitBill,
        toggleSplitMemberSettled,
        deleteSplitBill,
        addSavingGoal,
        updateSavingProgress,
        deleteSavingGoal,
        resetToDefault,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance harus digunakan di dalam FinanceProvider');
  }
  return context;
}
