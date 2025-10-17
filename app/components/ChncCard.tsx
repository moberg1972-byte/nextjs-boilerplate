// app/components/ChncCard.tsx
type ChncRow = {
  row_key: string;             // "YouTube", "Steam", "X", etc.
  platform: string | null;
  format: string | null;       // "News", "Announcements", ...
  channel_series: string | null;
  cadence_12m: number | null;
  cadence_90d: number | null;
  cadence_phrase: string | null; // "1/mo", "2–3/mo", ...
  audience_locus: "owned" | "community" | string | null;
  example_url: string | null;
  example_date: string | null; // ISO string like "2023-09-15"
  timing_nouns?: string[] | null;
  notes?: string | null;
  pcl_id?: string | null;
  evidence?: string | null;
};

export type ChncPayload = {
  rows: ChncRow[];
  preset_rows?: string[]; // preferred display order + placeholders
};

function fmt(n: number | null | undefined) {
  return typeof n === "number" && Number.isFinite(n) ? n.toString() : "—";
}

function fmtDate(d: string | null | undefined) {
  if (!d) return "—";
  const dt = new Date(d);
  return Number.isNaN(dt.valueOf()) ? "—" : dt.toISOString().slice(0, 10);
}

function uniqOrder(presets: string[] | undefined, rows: ChncRow[]) {
  const seen = new Set<string>();
  const ordered: ChncRow[] = [];
  // 1) preset order (with placeholders if missing)
  if (presets?.length) {
    for (const key of presets) {
      const hit = rows.find(r => (r.row_key ?? r.platform) === key);
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
          notes: "—",
          pcl_id: null,
          evidence: null,
        });
        seen.add(key);
      }
    }
  }
  // 2) any remaining rows not in presets (append)
  for (const r of rows) {
    const key = r.row_key ?? r.platform ?? "";
    if (!seen.has(key)) ordered.push(r);
  }
  return ordered;
}

export function ChncCard({ title, payload }: { title?: string; payload: ChncPayload }) {
  const ordered = uniqOrder(payload.preset_rows, payload.rows);

  return (
    <article style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: 16 }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
        <h2 style={{ margin: 0 }}>{title ?? "UA Channels & Cadence"}</h2>
        <small style={{ color: '#6b7280' }}>
          {payload.rows.length} populated · {payload.preset_rows?.length ?? 0} presets
        </small>
      </header>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>
              <th style={{ padding: '8px 6px' }}>Platform</th>
              <th style={{ padding: '8px 6px' }}>Format</th>
              <th style={{ padding: '8px 6px' }}>Series</th>
              <th style={{ padding: '8px 6px' }}>Cadence (12m / 90d)</th>
              <th style={{ padding: '8px 6px' }}>Phrase</th>
              <th style={{ padding: '8px 6px' }}>Audience</th>
              <th style={{ padding: '8px 6px' }}>Example</th>
              <th style={{ padding: '8px 6px' }}>Timing nouns</th>
              <th style={{ padding: '8px 6px' }}>Notes</th>
            </tr>
          </thead>
          <tbody>
            {ordered.map((r, i) => {
              const isPlaceholder =
                r.format === null &&
                r.channel_series === null &&
                r.cadence_12m === null &&
                r.cadence_90d === null &&
                r.cadence_phrase === null &&
                r.example_url === null;

              return (
                <tr key={`${r.row_key}-${i}`} style={{ borderBottom: '1px solid #f3f4f6', opacity: isPlaceholder ? 0.6 : 1 }}>
                  <td style={{ padding: '10px 6px', fontWeight: 600 }}>{r.platform ?? r.row_key}</td>
                  <td style={{ padding: '10px 6px' }}>{r.format ?? '—'}</td>
                  <td style={{ padding: '10px 6px' }}>{r.channel_series ?? '—'}</td>
                  <td style={{ padding: '10px 6px' }}>{fmt(r.cadence_12m)} / {fmt(r.cadence_90d)}</td>
                  <td style={{ padding: '10px 6px' }}>{r.cadence_phrase ?? '—'}</td>
                  <td style={{ padding: '10px 6px', textTransform: 'capitalize' }}>{r.audience_locus ?? '—'}</td>
                  <td style={{ padding: '10px 6px' }}>
                    {r.example_url ? (
                      <a href={r.example_url} target="_blank" rel="noreferrer">
                        {fmtDate(r.example_date)}
                      </a>
                    ) : '—'}
                  </td>
                  <td style={{ padding: '10px 6px' }}>
                    {Array.isArray(r.timing_nouns) && r.timing_nouns.length
                      ? r.timing_nouns.join(', ')
                      : '—'}
                  </td>
                  <td style={{ padding: '10px 6px' }}>{r.notes ?? '—'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </article>
  );
}

