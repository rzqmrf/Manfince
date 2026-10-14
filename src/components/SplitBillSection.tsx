'use client';

import React, { useState } from 'react';
import { useFinance } from '@/context/FinanceContext';
import { formatRupiah, formatDateIndo } from '@/lib/utils';
import { 
  Users, 
  Plus, 
  Trash2, 
  CheckCircle, 
  Clock, 
  UserCheck, 
  X, 
  Receipt,
  UserPlus
} from 'lucide-react';

export function SplitBillSection() {
  const { splitBills, toggleSplitMemberSettled, deleteSplitBill, addSplitBill } = useFinance();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [totalAmount, setTotalAmount] = useState<number | ''>('');
  const [memberNames, setMemberNames] = useState<string[]>(['']);

  // Total uang yang belum ditransfer teman ke kita
  const totalPendingReceivable = splitBills.reduce((sum, bill) => {
    const pendingInBill = bill.members
      .filter((m) => !m.isSettled)
      .reduce((mSum, m) => mSum + m.shareAmount, 0);
    return sum + pendingInBill;
  }, 0);

  const handleAddMemberField = () => {
    setMemberNames([...memberNames, '']);
  };

  const handleMemberNameChange = (index: number, val: string) => {
    const updated = [...memberNames];
    updated[index] = val;
    setMemberNames(updated);
  };

  const handleRemoveMemberField = (index: number) => {
    setMemberNames(memberNames.filter((_, i) => i !== index));
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validMembers = memberNames.map((m) => m.trim()).filter(Boolean);
    if (!title.trim() || !totalAmount || Number(totalAmount) <= 0 || validMembers.length === 0) return;

    // Hitung bagi rata (termasuk "Saya" + teman-teman)
    const totalPeople = validMembers.length + 1; // 1 adalah "Saya" yang bayar duluan
    const sharePerPerson = Math.round(Number(totalAmount) / totalPeople);

    addSplitBill({
      title: title.trim(),
      totalAmount: Number(totalAmount),
      paidBy: 'Saya',
      date: new Date().toISOString().split('T')[0],
      members: validMembers.map((name, i) => ({
        id: `m-${Date.now()}-${i}`,
        name,
        shareAmount: sharePerPerson,
        isSettled: false,
      })),
    });

    // Reset & close
    setTitle('');
    setTotalAmount('');
    setMemberNames(['']);
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-4">
      {/* Banner Piutang Patungan */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4 sm:p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-500" />
              Patungan & Split Bill Anak Kos
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Catatan beli galon, gas, atau makan bareng agar tidak lupa menagih teman kos
            </p>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1 self-start sm:self-auto transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Buat Patungan</span>
          </button>
        </div>

        {/* Highlight Card */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 border border-emerald-100 dark:border-emerald-900/40 flex items-center justify-between">
          <div>
            <span className="text-xs text-emerald-700 dark:text-emerald-400 font-medium block">
              Total Piutang Belum Ditransfer ke Kamu:
            </span>
            <span className="text-xl sm:text-2xl font-black text-emerald-800 dark:text-emerald-200">
              {formatRupiah(totalPendingReceivable)}
            </span>
          </div>
          <div className="p-3 bg-white dark:bg-zinc-800 rounded-xl shadow-xs text-emerald-600 dark:text-emerald-400">
            <Receipt className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* List of Split Bills */}
      <div className="space-y-3">
        {splitBills.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 text-zinc-400 text-xs">
            Belum ada catatan patungan. Klik tombol "Buat Patungan" untuk menambahkan.
          </div>
        ) : (
          splitBills.map((bill) => {
            const allSettled = bill.members.every((m) => m.isSettled);

            return (
              <div
                key={bill.id}
                className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4 sm:p-5 shadow-sm space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-zinc-900 dark:text-white">
                        {bill.title}
                      </h4>
                      {allSettled ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                          Semua Lunas
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                          Menunggu Transfer
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      Total: {formatRupiah(bill.totalAmount)} • Ditalangi oleh: <strong className="text-zinc-600 dark:text-zinc-300">{bill.paidBy}</strong> • {formatDateIndo(bill.date)}
                    </p>
                  </div>

                  <button
                    onClick={() => deleteSplitBill(bill.id)}
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                    title="Hapus patungan"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Roommates Checklist */}
                <div className="divide-y divide-zinc-100 dark:divide-zinc-800 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                  {bill.members.map((member) => (
                    <div
                      key={member.id}
                      className="py-2 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${
                            member.isSettled
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300'
                              : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
                          }`}
                        >
                          {member.name.charAt(0).toUpperCase()}
                        </div>
                        <span className={member.isSettled ? 'text-zinc-500 line-through' : 'font-medium text-zinc-900 dark:text-white'}>
                          {member.name}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                          {formatRupiah(member.shareAmount)}
                        </span>

                        <button
                          onClick={() => toggleSplitMemberSettled(bill.id, member.id)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-medium flex items-center gap-1 transition-all ${
                            member.isSettled
                              ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-200'
                              : 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 hover:bg-amber-200'
                          }`}
                        >
                          {member.isSettled ? (
                            <>
                              <CheckCircle className="w-3 h-3" />
                              <span>Sudah Bayar</span>
                            </>
                          ) : (
                            <>
                              <Clock className="w-3 h-3" />
                              <span>Belum Transfer</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal Buat Patungan */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 p-6 overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800 mb-4">
              <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                Buat Catatan Patungan Baru
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
                  Nama Keperluan / Kegiatan
                </label>
                <input
                  type="text"
                  required
                  placeholder="Misal: Beli Galon & Gas Kosan, Makan Bareng"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-500 mb-1">
                  Total Tagihan Keseluruhan (Rp)
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  placeholder="50000"
                  value={totalAmount}
                  onChange={(e) => setTotalAmount(e.target.value ? Number(e.target.value) : '')}
                  className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-medium text-zinc-500">
                    Teman yang Ikut Patungan
                  </label>
                  <button
                    type="button"
                    onClick={handleAddMemberField}
                    className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    + Tambah Teman
                  </button>
                </div>

                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {memberNames.map((name, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder={`Nama teman ${idx + 1} (misal: Rian Kamar 02)`}
                        value={name}
                        onChange={(e) => handleMemberNameChange(idx, e.target.value)}
                        className="flex-1 px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        required
                      />
                      {memberNames.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveMemberField(idx)}
                          className="p-1.5 text-zinc-400 hover:text-rose-500"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <p className="text-[11px] text-zinc-400 mt-1">
                  *Total biaya akan dibagi rata otomatis antara kamu dan teman-teman yang didaftarkan.
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors"
                >
                  Simpan & Bagikan Patungan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
