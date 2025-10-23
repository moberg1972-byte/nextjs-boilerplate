// ProseCard.tsx
return (
  <CardShell title={title} outputId={row.output_id} shadowless={row.output_id === 'CMP.CHNC.CHANNELS'}>
    {preview
      ? <div className="whitespace-pre-wrap break-words text-sm leading-6 text-zinc-700">{preview}</div>
      : <div className="text-sm text-zinc-400">No data yet.</div>
    }
  </CardShell>
);
