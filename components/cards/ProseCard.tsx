// components/cards/ProseCard.tsx
import CardShell from './CardShell';
import type { Row } from '@/types/outputs';

const PRIORITY_KEYS = [
  'paragraph','half_page','dossier','line','summary',
  'content','premise','tone','description','player_loop',
  'world_rules','title_promise'
];

// ---- heuristics -------------------------------------------------------------

// find the first useful string anywhere (for plain prose payloads)
function pickString(x: any): string | null {
  if (!x) return null;
  if (typeof x === 'string') {
    const s = x.trim();
    return s ? s : null;
  }
  if (Array.isArray(x)) {
    for (const it of x) {
      const s = pickString(it);
      if (s) return s;
    }
    return null;
  }
  if (typeof x === 'object') {
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
    for (const k of PRIORITY_KEYS) {
      if (k in x) {
        const s = pickString((x as any)[k]);
        if (s) return s;
      }
    }
    for (const v of Object.values(x)) {
      const s = pickString(v);
      if (s) return s;
    }
  }
  return null;
}

// detect “dictionary-like” payload: multiple string/array fields
function asKeyedSections(x: any): { label: string; value: string | string[] }[] | null {
  if (!x || typeof x !== 'object' || Array.isArray(x)) return null;

  const entries: { label: string; value: string | string[] }[] = [];

  const titleize = (k: string) =>
    k.replace(/[_\-]+/g, ' ')
     .replace(/\b\w/g, m => m.toUpperCase())
     .trim();

  const toText = (v: any): string | string[] | null => {
    if (!v && v !== 0) return null;
    if (typeof v === 'string') {
      const s = v.trim();
      return s || null;
    }
    if (Array.isArray(v)) {
      // keep string arrays as bullet list
      const items = v.map(it => (typeof it === 'string' ? it.trim() : '')).filter(Boolean);
      return items.length ? items : null;
    }
    // single-field objects with a known key → pull it
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

  // Require at least 2 sections to avoid duplicating the simple preview
  return entries.length >= 2 ? entries : null;
}

// ---- component --------------------------------------------------------------

export default function ProseCard({ row, title }: { row: Row; title: string }) {
  const payload = row.content_json;

  // 1) try “structured prose” view for dictionary-like objects
  const sections = asKeyedSections(payload);

  // 2) otherwise fall back to a single prose preview
  const preview = sections ? null : pickString(payload);

  return (
    <CardShell title={title} outputId={row.output_id}>
      {sections ? (
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
