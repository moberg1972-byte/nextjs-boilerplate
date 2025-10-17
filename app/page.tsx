return (
  <main className="mx-auto max-w-5xl space-y-6 p-6">
    <h1 className="text-2xl font-bold">UA Cadence & Channels + Ethos Essay</h1>
    <p className="text-sm text-zinc-500">
      Data source: {usingSupabase ? "Supabase live ✅" : "Sample 🧪"}
    </p>
    {chncRows?.length ? (
      <ChncCard title="Channels & Cadence (CMP.CHNC.CHANNELS)" payload={chncRows[0].content_json} />
    ) : (
      <p className="text-sm text-zinc-500">No CMP.CHNC.CHANNELS found for this doc.</p>
    )}
    {essayRows?.length ? (
      <EssayCard title="Company Ethos (CMP.ETHO.ESSAY)" payload={essayRows[0].content_json} />
    ) : (
      <p className="text-sm text-zinc-500">No CMP.ETHO.ESSAY found for this doc.</p>
    )}
  </main>
);
