export default function CardShell({
  title,
  outputId,
  children,
  variant = 'bevel', // 'bevel' | 'flat'
}: {
  title: string;
  outputId: string;
  children: React.ReactNode;
  variant?: 'bevel' | 'flat';
}) {
  const skin = variant === 'flat' ? 'card-base card-flat' : 'card-base card-bevel';

  return (
    <div className={`${skin} h-full p-4 flex flex-col`}>
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
