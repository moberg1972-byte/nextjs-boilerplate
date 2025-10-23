// components/cards/ProseCard.tsx
import CardShell from './CardShell';
import type { Row } from '@/types/outputs';

function extractSingle(content: any): string | null {
  if (!content) return null;
  if (typeof content === 'string') return content;
  if (typeof content.paragraph === 'string') return content.paragraph;
  if (typeof content.line === 'string') return content.line;
  if (typeof content.half_page === 'string') return content.half_page;
  if (typeof content.dossier === 'string') return content.dossier;
  if (typeof content.gap === 'string') return content.gap;        // <-- GAP (string)
  if (typeof content?.gap?.line === 'string') return content.gap.line; // <-- GAP (object)
  return null;
}

function renderSignals(content: any) {
  const list = Array.isArray(content?.signals) ? content.signals : null;
  if (!list || list.length === 0) return null;

  return (
    <div className="space-y-2">
      {typeof content.summary === 'string' && content.summary.trim() && (
        <p className="text-sm leading-6 text-zinc-700 whitespace-pre-wrap break-words">
          {content.summary.trim()}
        </p>
      )}
      <ul className="list-disc list-inside text-sm leading-6 text-zinc-700">
        {list.map((s: any, i: number) => (
          <li key={i}>
            {s.date ? `${s.date} — ` : ''}
            {s.text}
            {s.pointer ? (
              <>
                {' '}
                (<a className="underline" href={s.pointer} target="_blank" rel="noreferrer">source</a>)
              </>
            ) : null}
            {s.tag ? ` [${s.tag}]` : null}
          </li>
        ))}
      </ul>
    </div>
  );
}

function renderList(content: any) {
  // items: array of strings or objects
  if (Array.isArray(content?.items) && content.items.length) {
    return (
      <ul className="list-disc list-inside text-sm leading-6 text-zinc-700">
        {content.items.map((it: any, i: number) => {
          if (typeof it === 'string') return <li key={i}>{it}</li>;
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
                  (<a className="underline" href={it.pointer} target="_blank" rel="noreferrer">source</a>)
                </>
              ) : null}
            </li>
          );
        })}
      </ul>
    );
  }

  // rows: array of strings or objects (beats etc.)
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
                  (<a className="underline" href={r.pointer} target="_blank" rel="noreferrer">source</a>)
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
  const content = row?.content_json;
  const single = extractSingle(content);
  const signals = renderSignals(content);
  const list = renderList(content);

  return (
    <CardShell title={title} outputId={row.output_id}>
      {single ? (
        <p className="w-full break-words whitespace-pre-line text-sm text-zinc-700 leading-6">
          {single}
        </p>
      ) : signals ? (
        signals
      ) : list ? (
        list
      ) : (
        <p className="text-sm text-zinc-400">No data yet.</p>
      )}
    </CardShell>
  );
}
