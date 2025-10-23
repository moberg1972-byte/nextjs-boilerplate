// components/cards/CardShell.tsx
import React from 'react';
import { UI } from '@/lib/ui';

// components/cards/CardShell.tsx
export default function CardShell({ title, outputId, shadowless = false, children }:{
  title: string; outputId: string; shadowless?: boolean; children: React.ReactNode;
}) {
  return (
    <div className={`h-full rounded-2xl bg-white ${shadowless ? '' : 'shadow-[0_2px_20px_rgba(0,0,0,0.06)]'} p-4 flex flex-col`}>
      <div className="mb-2">
        <div className="text-[18px] font-semibold leading-6 text-zinc-900">{title}</div>
        <div className="text-[10px] uppercase tracking-wide text-zinc-500">{outputId}</div>
      </div>
      <div className="min-h-0 flex-1 overflow-auto">{children}</div>
    </div>
  );
}

