// lib/lanePage.tsx
import { supabase } from '@/lib/supabase';
import type { LaneDefinition } from '@/types/outputs';
import ProseCard from '@/components/cards/ProseCard';
import NameValueCard from '@/components/cards/NameValueCard';
import TableCard from '@/components/cards/TableCard';
import FallbackCard from '@/components/cards/FallbackCard';

type Row = {
  doc_id: string;
  lane_id: string;
  job_id: string;
  output_id: string;
  card_type: string | null;
  human_title: string | null;
  content_json: any;
};

function kindFor(row: Row | undefined, def: LaneDefinition, b: any) {
  if (!row) return 'fallback';
  // prefer DB hint, then layout hint
  return (row.card_type || def.cardMap?.[b.id] || 'prose').toUpperCase();
}

function renderCard(kind: string, row: Row | undefined, title: string) {
  if (!row) return <FallbackCard title={title} outputId={title} />;
  switch (kind) {
    case 'NAME_VALUE':
      return <NameValueCard row={row} title={title} />;
    case 'TABLE':
      return <TableCard row={row} title={title} />;
    case 'PROSE':
    default:
      return <ProseCard row={row} title={title} />;
  }
}

function spanClasses(b: { colSpan?: number; rowSpan?: number }) {
  const cls: string[] = [];
  if (b.colSpan) {
    cls.push(`xl:col-span-${b.colSpan}`);
    if (b.colSpan >= 2) cls.push(`md:col-span-${Math.min(3, b.colSpan)}`);
  }
  if (b.rowSpan && b.rowSpan > 1) {
    cls.push(`md:row-span-${b.rowSpan}`, `xl:row-span-${b.rowSpan}`);
  }
  // wrapper must not clip the card’s internal scroll
  cls.push('min-h-0');
  return cls.join(' ');
}

export default async function LanePage({ def }: { def: LaneDefinition }) {
  // fetch
  const { data, error } = await supabase
    .from('v_instruction_outputs_v2')
    .select('doc_id,lane_id,job_id,output_id,content_json,card_type,human_title')
    .eq('lane_id', def.laneId)
    .order('output_id', { ascending: true });

  if (error) {
    return <pre className="p-4 text-sm text-red-600">Supabase error: {error.message}</pre>;
  }

  const rows = (data ?? []) as Row[];
  const byId: Record<string, Row> = {};
  for (const r of rows) byId[r.output_id] = r;

  return (
    <main className="px-6 py-6">
      <h1 className="text-lg font-semibold">CMP — Review</h1>
      <p className="text-xs text-zinc-500 mb-4">
        Live data from Supabase. Sectioned, 6-column grid.
      </p>

      {def.sections.map((sec) => (
        <section key={sec.title} className="min-h-0">
          {/* Section header */}
          <h3 className="mt-8 mb-3 text-xs font-semibold tracking-wide text-zinc-500">
            {sec.title}
          </h3>

          {/* Section grid with hard row height (inline style prevents purge) */}
          <div
            className="grid gap-4 grid-cols-1 md:grid-cols-3 xl:grid-cols-6 min-h-0"
            style={{ gridAutoRows: `${sec.rowHeight}px` }}
          >
            {sec.blocks.map((b) => {
              const row = byId[b.id];
              const title = row?.human_title ?? def.titles?.[b.id] ?? b.id;
              const classes = spanClasses(b);

              return (
                <div key={b.id} className={classes}>
                  {/* h-full is critical: card must fill the grid cell */}
                  <div className="h-full">
                    {renderCard(kindFor(row, def, b), row, title)}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </main>
  );
}
