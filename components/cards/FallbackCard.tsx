// components/cards/FallbackCard.tsx
import CardShell from './CardShell';
import type { Row } from '@/types/outputs';

export default function FallbackCard({ row, title }: { row: Row; title: string }) {
  return (
    <CardShell title={title} outputId={row.output_id}>
      <pre className="text-xs bg-zinc-950 text-zinc-50 rounded-xl p-3 overflow-auto max-h-64">
        {JSON.stringify(row.content_json, null, 2)}
      </pre>
    </CardShell>
  );
}
