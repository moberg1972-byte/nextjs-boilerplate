// components/cards/ProseCard.tsx
import CardShell from './CardShell';
import type { Row } from '@/types/outputs';

const PRIORITY_KEYS = [
  // direct prose
  'paragraph', 'half_page', 'dossier', 'line', 'summary',
  // common alternates we see in PRO
  'content', 'premise', 'tone', 'description', 'player_loop',
  'world_rules', 'title_promise'
];

// depth-first: return first useful string
function pickString(x: any): string | null {
  if (!x) return null;

  if (typeof x === 'string') {
    const s = x.trim();
    return s.length ? s : null;
  }

  if (Array.isArray(x)) {
    for (const item of x) {
      const s = pickString(item);
      if (s) return s;
    }
    return null;
  }

  if (typeof x === 'object') {
    // common container fields
    if ('paragraphs' in x) {
      const s = pickString((x as any).paragraphs);
      if (s) return s;
    }
    if ('content' in x) {
      const s = pickString((x as any).content);
      if (s) return s;
    }
    if ('world' in x) {
      const s = pickString((x as any).world);
      if (s) return s;
    }

    // try priority keys first
    for (const k of PRIORITY_KEYS) {
      if (k in x) {
        const s = pickString((x as any)[k]);
        if (s) return s;
      }
    }

    // then scan remaining values
    for (const v of Object.values(x)) {
      const s = pickString(v);
      if (s) return s;
    }
  }

  return null;
}

export default function ProseCard({ row, title }: { row: Row; title: string }) {
  const preview = pickString(row.content_json);

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
