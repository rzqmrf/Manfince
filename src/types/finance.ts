export type ExpenseCategory = 
  | 'makan' 
  | 'belanja' 
  | 'transport' 
  | 'nongkrong' 
  | 'kuliah' 
  | 'kesehatan' 
  | 'lainnya';

export type IncomeCategory = 
  | 'kiriman' 
  | 'gaji' 
  | 'freelance' 
  | 'beasiswa' 
  | 'lainnya';

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: 'expense' | 'income';
  category: ExpenseCategory | IncomeCategory;
  date: string; // ISO string YYYY-MM-DD
  time?: string; // HH:mm
  note?: string;
}

export type FixedCostCategory = 'kos' | 'listrik' | 'internet' | 'laundry' | 'air_gas' | 'lainnya';

export interface FixedCost {
  id: string;
  name: string;
  amount: number;
  dueDate: number; // Tanggal jatuh tempo (1-31)
  isPaid: boolean;
  category: FixedCostCategory;
  note?: string;
}

export interface SplitBillMember {
  id: string;
  name: string;
  shareAmount: number;
  isSettled: boolean;
}

export interface SplitBill {
  id: string;
  title: string;
  totalAmount: number;
  paidBy: string; // Misal: "Saya" atau nama teman
  date: string;
  members: SplitBillMember[];
}

export interface SavingGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate?: string;
  category?: 'gadget' | 'kendaraan' | 'mudik' | 'darurat' | 'lainnya';
}

export interface UserProfile {
  name: string;
  currentBalance: number;
  monthlyAllowance: number;
  nextPaydayDate: number; // Tanggal kiriman/gajian berikutnya (1-31)
  minimumDailyTarget: number; // Batas minimal harian agar tidak krisis (misal Rp 25.000)
}
