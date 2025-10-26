// components/cards/ProseCard.tsx
import CardShell from './CardShell';
import type { Row } from '@/types/outputs';

const PRIORITY_KEYS = [
  // prefer actual prose first
  'text',
  'paragraph','half_page','dossier','line','summary',
  'content','premise','tone','description','player_loop',
  'world_rules','title_promise'
];

// tag tokens like [E], [I-M], [@U]
const TAG_TOKEN = /^\[[A-Z@\-]+\]$/i;

function preferLonger(a: string | null, b: string | null) {
  const A = (a ?? '').trim();
  const B = (b ?? '').trim();
  if (!A) return B || null;
  if (!B) return A || null;
  return B.length > A.length ? B : A;
}

// ---- heuristics -------------------------------------------------------------

// find a useful string anywhere (prefer 'text', ignore tag tokens)
function pickString(x: any): string | null {
  if (!x) return null;

  if (typeof x === 'string') {
    const s = x.trim();
    return s && !TAG_TOKEN.test(s) && s.length >= 12 ? s : null; // avoid short/taggy tokens
  }

  if (Array.isArray(x)) {
    let best: string | null = null;
    for (const it of x) best = preferLonger(best, pickString(it));
    return best;
  }

  if (typeof x === 'object') {
    // Common shape: { paragraphs: [{ text, tags }] }
    if ('paragraphs' in x) {
      // explicitly look for paragraph.text first
      const ps = (x as any).paragraphs;
      if (Array.isArray(ps)) {
        let best: string | null = null;
        for (const p of ps) {
          if (p && typeof p === 'object' && typeof p.text === 'string') {
            const s = pickString(p.text);
            best = preferLonger(best, s);
          }
        }
        if (best) return best;
      }
      // fallback: recurse normally
      const s = pickString(ps);
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

    // explicit priority keys (now includes 'text')
    for (const k of PRIORITY_KEYS) {
      if (k in x) {
        const s = pickString((x as any)[k]);
        if (s) return s;
      }
    }

    // generic sweep, but skip fields named 'tags'
    for (const [k, v] of Object.entries(x)) {
      if (k === 'tags') continue;
      const s = pickString(v);
      if (s) return s;
    }
  }
  return null;
}

// detect “dictionary-like” payload: multiple string/array fields
function asKeyedSections(x: any): { label: string; value: string | string[] }[] | null {
  if (!x || typeof x !== 'object' || Array.isArray(x)) return null;
  if ('rows' in x && Array.isArray((x as any).rows)) return null; // let rows renderer handle it

  const entries: { label: string; value: string | string[] }[] = [];

  const titleize = (k: string) =>
    k.replace(/[_\-]+/g, ' ')
     .replace(/\b\w/g, m => m.toUpperCase())
     .trim();

  const toText = (v: any): string | string[] | null => {
    if (v === null || v === undefined) return null;
    if (typeof v === 'string') {
      const s = v.trim();
      return s && !TAG_TOKEN.test(s) ? s : null;
    }
    if (Array.isArray(v)) {
      const items = v
        .map(it => (typeof it === 'string' ? it.trim() : ''))
        .filter(s => s && !TAG_TOKEN.test(s));
      return items.length ? items : null;
    }
    if (typeof v === 'object') {
      for (const k of PRIORITY_KEYS) {
        if (k in v) {
          const s = toText((v as any)[k]);
          if (s) return s;
        }
      }
    }
    return null;
  };

  for (const [k, v] of Object.entries(x)) {
    const val = toText(v);
    if (!val) continue;
    entries.push({ label: titleize(k), value: val });
  }

  return entries.length >= 2 ? entries : null;
}

// simple renderer for { rows: [{ beat, date, notes, surface, pointer } ...] }
function asRowsList(x: any): null | Array<{
  primary: string;
  secondary?: string;
  meta?: string;
  href?: string;
}> {
  const rows = x && typeof x === 'object' ? (x as any).rows : null;
  if (!Array.isArray(rows) || rows.length === 0) return null;

  const out: Array<{ primary: string; secondary?: string; meta?: string; href?: string }> = [];

  for (const r of rows) {
    if (!r || typeof r !== 'object') continue;
    const primary = String(r.beat ?? r.title ?? r.name ?? '').trim();
    const secondary = String(r.notes ?? r.description ?? '').trim() || undefined;
    const meta = [r.date, r.surface].filter(Boolean).join(' • ') || undefined;
    const href = typeof r.pointer === 'string' ? r.pointer : undefined;
    if (!primary) continue;
    out.push({ primary, secondary, meta, href });
  }

  return out.length ? out : null;
}

// ---- component --------------------------------------------------------------

export default function ProseCard({ row, title }: { row: Row; title: string }) {
  const payload = row.content_json;

  const rowsList = asRowsList(payload);              // 0) timeline/list if present
  const sections = rowsList ? null : asKeyedSections(payload);  // 1) dictionary-like
  const preview  = rowsList || sections ? null : pickString(payload); // 2) plain prose

  return (
    <CardShell title={title} outputId={row.output_id}>
      {rowsList ? (
        <ul className="space-y-3">
          {rowsList.map((r, i) => (
            <li key={i} className="text-sm leading-6">
              <div className="font-medium text-zinc-800">
                {r.href ? <a href={r.href} target="_blank" rel="noreferrer" className="underline underline-offset-2">{r.primary}</a> : r.primary}
              </div>
              {r.meta && <div className="text-xs text-zinc-500">{r.meta}</div>}
              {r.secondary && <div className="text-zinc-700 whitespace-pre-line">{r.secondary}</div>}
            </li>
          ))}
        </ul>
      ) : sections ? (
        <div className="space-y-3">
          {sections.map(({ label, value }) => (
            <div key={label}>
              <div className="text-xs font-semibold tracking-wide text-zinc-500 mb-1">{label}</div>
              {Array.isArray(value) ? (
                <ul className="list-disc pl-5 text-sm text-zinc-700 leading-6">
                  {value.map((li, i) => <li key={i}>{li}</li>)}
                </ul>
              ) : (
                <p className="text-sm text-zinc-700 leading-6 whitespace-pre-line break-words">
                  {value}
                </p>
              )}
            </div>
          ))}
        </div>
      ) : preview ? (
        <p className="w-full break-words whitespace-pre-line text-sm text-zinc-700 leading-6">
          {preview}
        </p>
      ) : (
        <p className="text-sm text-zinc-400">No data yet.</p>
      )}
    </CardShell>
  );
}
