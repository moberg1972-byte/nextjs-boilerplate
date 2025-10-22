// components/cards/NameValueCard.tsx
import CardShell from './CardShell';
import type { Row } from '@/types/outputs';

function pairs(obj: Record<string, any>) {
  // filter out noisy keys if needed
  const order = ['title','platforms','release_date','audience_type','business_model','expected_reach','dev_cycle_years','creative_director','budget_estimate_eur'];
  const keys = order.filter(k => obj[k] !== undefined).slice(0, 10);
  return keys.map(k => [k, obj[k]] as const);
}

export default function NameValueCard({ row, title }: { row: Row; title: string }) {
  const kv = pairs(row.content_json || {});
  return (
    <CardShell title={title} outputId={row.output_id}>
      <dl className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
        {kv.map(([k,v]) => (
          <div key={k}>
            <dt className="text-[10px] uppercase tracking-wide text-zinc-500">{k}</dt>
            <dd className="text-zinc-800">{Array.isArray(v)? v.join(', ') : String(v)}</dd>
          </div>
        ))}
      </dl>
    </CardShell>
  );
}
