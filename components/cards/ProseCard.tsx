// components/cards/ProseCard.tsx
import CardShell from './CardShell';
import type { Row } from '@/types/outputs';

function extractPreview(content: any, outputId: string): string | null {
  if (content?.paragraph) return content.paragraph;
  if (content?.line) return content.line;
  if (content?.half_page) return content.half_page;
  if (content?.dossier) return content.dossier;
  return null;
}

export default function ProseCard({ row, title }: { row: Row; title: string }) {
  const preview = extractPreview(row.content_json, row.output_id);
  
  return (
    <CardShell title={title} outputId={row.output_id}>
      {preview ? (
        <p className="w-full break-words whitespace-pre-line text-sm text-zinc-700 leading-6">
          {preview}
        </p>
      ) : (
        <p className="text-sm text-zinc-400">No data yet.</p>
      )}
    </CardShell>
  );
}
