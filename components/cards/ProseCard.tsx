// components/cards/ProseCard.tsx
import CardShell from './CardShell';
import type { Row } from '@/types/outputs';

export default function ProseCard({ row, title }: { row: Row; title: string }) {
  const p = row.content_json;
  const preview =
    p?.paragraph ??
    p?.line ??
    (Array.isArray(p?.bullets) ? p.bullets.map((b:any)=>b.text).slice(0,2).join(' • ') : '');

  return (
    <CardShell title={title} outputId={row.output_id} shadowless={row.output_id==='CMP.CHNC.CHANNELS'}>
      <p className="text-sm text-zinc-700 leading-6 line-clamp-6">{preview}</p>
      {/* Later: render subtitles, lists, etc., from a small prose schema */}
    </CardShell>
  );
}
