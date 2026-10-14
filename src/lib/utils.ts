export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatCompactRupiah(amount: number): string {
  if (amount >= 1_000_000) {
    const val = (amount / 1_000_000).toFixed(1).replace('.0', '');
    return `Rp ${val} Jt`;
  }
  if (amount >= 1_000) {
    const val = (amount / 1_000).toFixed(0);
    return `Rp ${val} Rb`;
  }
  return `Rp ${amount}`;
}

export function formatDateIndo(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date);
  } catch {
    return dateStr;
  }
}
