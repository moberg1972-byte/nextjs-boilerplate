// app/components/ChncCard.tsx

// Types for the CMP.CHNC.CHANNELS payload
export type ChncRow = {
  row_key: string;
  platform: string | null;
  format: string | null;
  channel_series: string | null;
  cadence_12m: number | null;
  cadence_90d: number | null;
  cadence_phrase: string | null;
  audience_locus: string | null;
  example_url: string | null;
  example_date: string | null;
  timing_nouns?: string[] | null;
  notes?: string | null;
  pcl_id?: string | null;
  evidence?: string | null;
};

export type ChncPayload = {
  rows: ChncRow[];
  preset_rows?: string[];
};

// Helper: order rows by presets and include placeholders
function uniqOrder(presets: string[] | undefined, rows: ChncRow[]) {
  const seen = new Set<string>();
  const ordered: ChncRow[] = [];

  if (presets?.length) {
    for (const key of presets) {
      const hit = rows.find(r => (r.row_key ?? r.platform ?? '') === key);
      if (hit) {
        ordered.push(hit);
        seen.add(hit.row_key ?? hit.platform ?? key);
      } else {
        ordered.push({
          row_key: key,
          platform: key,
          format: null,
          channel_series: null,
          cadence_12m: null,
          cadence_90d: null,
          cadence_phrase: null,
          audience_locus: null,
          example_url: null,
          example_date: null,
          timing_nouns: null,
          notes: '—',
          pcl_id: null,
          evidence: null,
        });
        seen.add(key);
      }
    }
  }

  for (const r of rows) {
    const key = r.row_key ?? r.platform ?? '';
    if (!seen.has(key)) ordered.push(r);
  }
  return ordered;
}

export function ChncCard({ title, payload }: { title?: string; payload: ChncPayload }) {
  const ordered = uniqOrder(payload.preset_rows, payload.rows);

  return (
    <article className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
      <header className="mb-3 flex items-baseline justify-between">
        <h2 className="m-0 text-lg font-semibold">{title ?? 'UA Channels & Cadence'}</h2>
        <small className="text-zinc-500">
          {payload.rows.length} populated · {payload.preset_rows?.length ?? 0} presets
        </small>
      </header>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-sm">
          <thead className="bg-zinc-50 text-left font-medium">
            <tr className="border-b border-zinc-200">
              <th className="p-2">Platform</th>
              <th className="p-2">Format</th>
              <th className="p-2">Series</th>
              <th className="p-2">Cadence (12m / 90d)</th>
              <th className="p-2">Phrase</th>
              <th className="p-2">Audience</th>
              <th className="p-2">Example</th>
              <th className="p-2">Timing nouns</th>
              <th className="p-2">Notes</th>
            </tr>
          </thead>
          <tbody>
            {ordered.map((r, i) => {
              const placeholder =
                !r.format && !r.channel_series && !r.cadence_phrase && !r.example_url;
              return (
                <tr
                  key={`${r.row_key}-${i}`}
                  className={`border-b border-zinc-100 ${placeholder ? 'opacity-60' : ''}`}
                >
                  <td className="p-2 font-semibold">{r.platform ?? r.row_key}</td>
                  <td className="p-2">{r.format ?? '—'}</td>
                  <td className="p-2">{r.channel_series ?? '—'}</td>
                  <td className="p-2">
                    {r.cadence_12m ?? '—'} / {r.cadence_90d ?? '—'}
                  </td>
                  <td className="p-2">{r.cadence_phrase ?? '—'}</td>
                  <td className="p-2 capitalize">{r.audience_locus ?? '—'}</td>
                  <td className="p-2">
                    {r.example_url ? (
                      <a
                        href={r.example_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {r.example_date?.slice(0, 10) ?? 'link'}
                      </a>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td className="p-2">{r.timing_nouns?.join(', ') ?? '—'}</td>
                  <td className="p-2">{r.notes ?? '—'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </article>
  );
}
