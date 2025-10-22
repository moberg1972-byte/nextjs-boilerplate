// components/cards/TableCard.tsx
import CardShell from './CardShell';
import type { Row } from '@/types/outputs';

export default function TableCard({ row, title }: { row: Row; title: string }) {
  const rows = Array.isArray(row.content_json?.rows) ? row.content_json.rows : [];

  return (
    <CardShell title={title} outputId={row.output_id} shadowless>
      {!rows.length ? (
        <p className="text-sm text-zinc-400">No rows yet.</p>
      ) : (
        <div className="overflow-auto max-h-full">
          <table className="min-w-full text-xs leading-5">
            <thead className="text-zinc-600">
              <tr>
                {['Platform','Format','Series','Cadence (12m/90d)','Phrase','Audience','Example','Timing','Notes'].map((h) => (
                  <th key={h} className="text-left font-medium py-1 pr-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r: any, i: number) => (
                <tr key={i} className={i % 2 ? 'bg-white' : 'bg-zinc-50/50'}>
                  <td className="py-1 pr-3 whitespace-nowrap">{r.platform ?? '—'}</td>
                  <td className="py-1 pr-3 whitespace-nowrap">{r.format ?? '—'}</td>
                  <td className="py-1 pr-3 whitespace-nowrap">{r.channel_series ?? '—'}</td>
                  <td className="py-1 pr-3 whitespace-nowrap">{(r.cadence_12m ?? '—')} / {(r.cadence_90d ?? '—')}</td>
                  <td className="py-1 pr-3 whitespace-nowrap">{r.cadence_phrase ?? '—'}</td>
                  <td className="py-1 pr-3 whitespace-nowrap">
                    {Array.isArray(r.audience_locus) ? r.audience_locus.join(', ') : r.audience_locus ?? '—'}
                  </td>
                  <td className="py-1 pr-3 whitespace-nowrap">{r.example_date ?? '—'}</td>
                  <td className="py-1 pr-3 whitespace-nowrap">
                    {Array.isArray(r.timing_nouns) ? r.timing_nouns.join(', ') : r.timing_nouns ?? '—'}
                  </td>
                  <td className="py-1 pr-3">{r.notes ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </CardShell>
  );
}

