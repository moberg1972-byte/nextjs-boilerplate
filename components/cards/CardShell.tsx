// components/cards/CardShell.tsx
export default function CardShell({
  title,
  outputId,
  shadowless = false,
  children,
}: {
  title: string;
  outputId: string;
  shadowless?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={[
        'h-full rounded-2xl bg-white p-4 flex flex-col',
        shadowless ? '' : 'shadow-[0_2px_20px_rgba(0,0,0,0.06)]'
      ].join(' ')}
    >
      <div className="mb-2">
        <div className="text-[16px] font-semibold leading-6 text-zinc-900">{title}</div>
        <div className="text-[10px] uppercase tracking-wide text-zinc-500">{outputId}</div>
      </div>
      <div className="min-h-0 flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
}
