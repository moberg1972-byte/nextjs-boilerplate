// components/cards/TableCard.tsx
import CardShell from './CardShell';
import type { Row } from '@/types/outputs';

function niceLabel(k: string): string {
  return k
    .replace(/_/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\b(\w)/g, (m) => m.toUpperCase());
}

function summarize(v: any): string {
  if (v == null) return '—';
  if (typeof v === 'string') return v;
  if (typeof v === 'number' || typeof v === 'boolean') return String(v);
  if (Array.isArray(v)) return v.map((x) => summarize(x)).join(', ');
  if (typeof v === 'object') {
    const prims = Object.entries(v)
      .filter(([, val]) => ['string', 'number', 'boolean'].includes(typeof val))
      .map(([k, val]) => `${niceLabel(k)}: ${String(val)}`);
    return prims.length ? prims.join(' • ') : JSON.stringify(v);
  }
  return String(v);
}

export default function TableCard({ row, title }: { row: Row; title: string }) {
  const rows: any[] = Array.isArray(row.content_json?.rows) ? row.content_json.rows : [];

  // Infer columns
  const blacklist = new Set(['id', '_id', '__typename']);
  const keySet = new Set<string>();
  for (const r of rows) {
    if (r && typeof r === 'object') {
      Object.keys(r).forEach((k) => !blacklist.has(k) && keySet.add(k));
    }
  }
  const inferred = Array.from(keySet);
  const preferred = [
    'platform','format','channel_series','cadence_12m','cadence_90d',
    'cadence_phrase','audience_locus','example_date','timing_nouns','notes'
  ];
  const columns = [
    ...preferred.filter((k) => keySet.has(k)),
    ...inferred.filter((k) => !preferred.includes(k)),
  ];

  return (
    <CardShell title={title} outputId={row.output_id} shadowless>
      {!rows.length ? (
        <p className="text-sm text-zinc-400">No rows yet.</p>
      ) : (
        <div className="overflow-auto max-h-full">
          <table className="min-w-full text-xs leading-5">
            <thead className="sticky top-0 bg-white text-zinc-600">
              <tr>
                {columns.map((k) => (
                  <th key={k} className="text-left font-medium py-1 pr-3 whitespace-nowrap">
                    {niceLabel(k)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r: any, i: number) => (
                <tr key={i} className={i % 2 ? 'bg-white' : 'bg-zinc-50/50'}>
                  {columns.map((k) => (
                    <td key={k} className="py-1 pr-3 align-top whitespace-nowrap">
                      {summarize(r?.[k])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </CardShell>
  );
}
