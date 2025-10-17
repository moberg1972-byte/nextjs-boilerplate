export function ChncCard({ title, payload }: { title?: string; payload: ChncPayload }) {
  const ordered = uniqOrder(payload.preset_rows, payload.rows);

  return (
    <article className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
      <header className="mb-3 flex items-baseline justify-between">
        <h2 className="m-0 text-lg font-semibold">{title ?? "UA Channels & Cadence"}</h2>
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
                  className={`border-b border-zinc-100 ${placeholder ? "opacity-60" : ""}`}
                >
                  <td className="p-2 font-semibold">{r.platform ?? r.row_key}</td>
                  <td className="p-2">{r.format ?? "—"}</td>
                  <td className="p-2">{r.channel_series ?? "—"}</td>
                  <td className="p-2">
                    {r.cadence_12m ?? "—"} / {r.cadence_90d ?? "—"}
                  </td>
                  <td className="p-2">{r.cadence_phrase ?? "—"}</td>
                  <td className="p-2 capitalize">{r.audience_locus ?? "—"}</td>
                  <td className="p-2">
                    {r.example_url ? (
                      <a href={r.example_url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                        {r.example_date?.slice(0, 10) ?? "link"}
                      </a>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="p-2">{r.timing_nouns?.join(", ") ?? "—"}</td>
                  <td className="p-2">{r.notes ?? "—"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </article>
  );
}
