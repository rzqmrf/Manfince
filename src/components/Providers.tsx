'use client';

import React from 'react';
import { FinanceProvider } from '@/context/FinanceContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return <FinanceProvider>{children}</FinanceProvider>;
}
