{/* Section header */}
<h3 className="mt-8 mb-3 text-xs font-semibold tracking-wide text-zinc-500">
  {sec.title}
</h3>

{/* Section grid with hard row height */}
<div
  className="grid gap-4 grid-cols-1 md:grid-cols-3 xl:grid-cols-6 min-h-0"
  style={{ gridAutoRows: `${sec.rowHeight}px` }}   // <- fixed row height
>
  {sec.blocks.map((b) => {
    const classes = spanClasses(b);
    const row = byId[b.id];
    const title = row?.human_title ?? def.titles?.[b.id] ?? b.id;

    return (
      <div key={b.id} className={`min-h-0 ${classes}`}>
        {/* h-full is critical on the card */}
        <div className="h-full">
          {renderCard(kindFor(row, def, b), row, title)}
        </div>
      </div>
    );
  })}
</div>
