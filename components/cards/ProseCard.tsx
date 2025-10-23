// components/cards/ProseCard.tsx
import CardShell from './CardShell';
import type { Row } from '@/types/outputs';

function extractPreview(content: any): string | null {
  if (!content) return null;
  if (typeof content === 'string') return content;
  if (content.paragraph) return content.paragraph;
  if (content.line) return content.line;
  if (content.half_page) return content.half_page;
  if (content.dossier) return content.dossier;
  return null;
}

function renderList(content: any) {
  // items: array of strings or objects
  if (Array.isArray(content?.items) && content.items.length) {
    return (
      <ul className="list-disc list-inside text-sm leading-6 text-zinc-700">
        {content.items.map((it: any, i: number) => {
          if (typeof it === 'string') return <li key={i}>{it}</li>;
          // Join common fields for readability
          const main = it.beat ?? it.unknown ?? it.risk ?? it.text ?? '';
          const bits = [
            it.date,
            it.surface,
            it.safest_surface,
            it.why_it_matters,
            it.notes,
          ].filter(Boolean);
          return (
            <li key={i}>
              {main}
              {bits.length ? ` — ${bits.join(' · ')}` : ''}
              {it.pointer ? (
                <>
                  {' '}
                  (<a className="underline" href={it.pointer} target="_blank">source</a>)
                </>
              ) : null}
            </li>
          );
        })}
      </ul>
    );
  }

  // rows: array of strings or objects (e.g., beats)
  if (Array.isArray(content?.rows) && content.rows.length) {
    return (
      <ul className="list-disc list-inside text-sm leading-6 text-zinc-700">
        {content.rows.map((r: any, i: number) => {
          if (typeof r === 'string') return <li key={i}>{r}</li>;
          const main = r.beat ?? r.unknown ?? r.risk ?? r.text ?? '';
          const bits = [r.date, r.surface, r.notes].filter(Boolean);
          return (
            <li key={i}>
              {main}
              {bits.length ? ` — ${bits.join(' · ')}` : ''}
              {r.pointer ? (
                <>
                  {' '}
                  (<a className="underline" href={r.pointer} target="_blank">source</a>)
                </>
              ) : null}
            </li>
          );
        })}
      </ul>
    );
  }

  return null;
}

export default function ProseCard({ row, title }: { row: Row; title: string }) {
  const content = row.content_json;
  const preview = extractPreview(content);
  const list = renderList(content);

  return (
    <CardShell title={title} outputId={row.output_id}>
      {preview ? (
        <p className="w-full break-words whitespace-pre-line text-sm text-zinc-700 leading-6">
          {preview}
        </p>
      ) : list ? (
        list
      ) : (
        <p className="text-sm text-zinc-400">No data yet.</p>
      )}
    </CardShell>
  );
}
