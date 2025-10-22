// components/cards/CardShell.tsx
import React from 'react';
import { UI } from '@/lib/ui';

export default function CardShell({
  title,
  outputId,
  children,
  shadowless = false,
}: {
  title: string;
  outputId: string;
  children: React.ReactNode;
  shadowless?: boolean;
}) {
  return (
    <div className={[
      'h-full bg-white', UI.cardRadius, UI.cardPad,
      shadowless ? '' : UI.cardShadow,
      'flex flex-col'
    ].join(' ')}>
      <div className="mb-1">
        <h3 className="text-base font-semibold leading-tight">{title}</h3>
        <p className="text-[11px] tracking-wide text-zinc-500">{outputId}</p>
      </div>
      {children}
    </div>
  );
}
