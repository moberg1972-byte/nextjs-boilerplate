// lib/ui.ts
export const UI = {
  maxWidth: 'max-w-[1960px]',
  bg: 'bg-zinc-100',
  cardRadius: 'rounded-2xl',
  cardShadow: 'shadow-lg',
  cardPad: 'p-4',
  sectionCols: 'grid-cols-1 md:grid-cols-3 xl:grid-cols-6',
  // helper to convert px to Tailwind arbitrary row height
  row: (h: number) => `auto-rows-[${h}px]`,  // <- fixed row height
};
