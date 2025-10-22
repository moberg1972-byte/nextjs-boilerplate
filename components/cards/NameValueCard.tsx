// components/cards/NameValueCard.tsx
import CardShell from './CardShell';
import type { Row } from '@/types/outputs';

const preferredOrder = [
  'title','platforms','release_date','audience_type',
  'business_model','expected_reach','dev_cycle_years',
  'creative_director','budget_estimate_eur'
];

function normalizeKV(obj: Record<string, any>) {
  if (!obj || typeof obj !== 'object') return [];
  const keys = preferredOrder.filter((k) => obj[k] !== undefined);
  // fallback: take first 10 primitive fields if preferred ones missing
  const extras = Object.keys(obj)
    .filter(k => !keys.includes(k) && (typeof obj[k] === 'string' || typeof obj[k] === 'number'))
    .slice(0, Math.max(0, 10 - keys.length));
  const final = [...keys, ...extras].slice(0, 10);
  return final.map(k => [k, obj[k]] as const);
}

export default function NameValueCard({ row, title }: { row: Row; title: string }) {
  const kv = normalizeKV(row.content_json || {});
  return (
    <CardShell title={title} outputId={row.output_id}>
      {kv.length ? (
        <dl className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
          {kv.map(([k,v]) => (
            <div key={k}>
              <dt className="text-[10px] uppercase tracking-wide text-zinc-500">{k.replace(/_/g,' ')}</dt>
              <dd className="text-zinc-800">
                {Array.isArray(v) ? v.join(', ') : String(v)}
              </dd>
            </div>
          ))}
        </dl>
      ) : (
        <p className="text-sm text-zinc-400">No data yet.</p>
      )}
    </CardShell>
  );
}
