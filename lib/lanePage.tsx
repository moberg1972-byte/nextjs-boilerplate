// lib/lanePage.tsx
import { UI } from '@/lib/ui';
import type { LaneDefinition, Row } from '@/types/outputs';
import ProseCard from '@/components/cards/ProseCard';
import NameValueCard from '@/components/cards/NameValueCard';
import TableCard from '@/components/cards/TableCard';
import FallbackCard from '@/components/cards/FallbackCard';
import CardShell from '@/components/cards/CardShell';
import { createClient } from '@supabase/supabase-js';

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="mt-8 mb-3">
      <div className="text-xs font-semibold tracking-wider text-zinc-500">{title}</div>
      <div className="mt-2 border-t border-zinc-200" />
    </div>
  );
}

function renderCard(kind: string, row: Row, title: string) {
  switch (kind) {
    case 'PROSE':      // DB value
    case 'prose':      // code-based fallback
      return <ProseCard row={row} title={title} />;
    case 'NAME_VALUE':
    case 'nameValue':
      return <NameValueCard row={row} title={title} />;
    case 'TABLE':
    case 'table':
      return <TableCard row={row} title={title} />;
    default:
      return <FallbackCard row={row} title={title} />;
  }
}

export async function LanePage({ def }: { def: LaneDefinition }) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data, error } = await supabase
    .from('v_instruction_outputs_v2')
    .select('doc_id,lane_id,job_id,output_id,content_json,card_type')
    .eq('lane_id', def.laneId)
    .order('output_id', { ascending: true });

  if (error) {
    return <pre className="p-8 text-sm text-red-600">Supabase error: {error.message}</pre>;
  }

  const byId: Record<string, Row> = Object.fromEntries((data ?? []).map(r => [r.output_id, r]));
  const planned = new Set(def.sections.flatMap(s => s.blocks.map(b => b.id)));
  const unplaced: Row[] = (data ?? []).filter(r => !planned.has(r.output_id));

  return (
    <main className={UI.bg}>
      <div className={`mx-auto px-4 py-10 ${UI.maxWidth}`}>
        <header className="mb-6">
          <h1 className="text-2xl font-bold">{def.laneId} — Review</h1>
          <p className="text-zinc-600">Live data from Supabase. Sectioned, 6-column grid.</p>
        </header>

        {def.sections.map((sec) => (
          <section key={sec.title}>
            <SectionHeader title={sec.title} />
            <div className={`grid gap-4 ${UI.sectionCols} ${UI.row(sec.rowHeight)}`}>
              {sec.blocks.map((b) => {
                const row = byId[b.id];
                if (!row) { ... }

                const dbType = row.card_type ?? null;                // <-- prefer DB hint
                const mapType = def.cardMap[b.id] ?? 'fallback';     // lane default
                const kind    = (dbType || mapType) as string;

                const title   = def.titles?.[b.id] ?? row.output_id;
                const span    = [
                  b.colSpan ? `xl:col-span-${b.colSpan}` : '',
                  b.rowSpan ? `xl:row-span-${b.rowSpan}` : '',
                ].join(' ').trim();

                return (
                  <div key={row.output_id} className={span}>
                  {renderCard(kind, row, title)}
                </div>
               );
             })}
            </div>
          </section>
        ))}

        {unplaced.length > 0 && (
          <section>
            <SectionHeader title="UNPLACED" />
            <div className={`grid gap-4 ${UI.sectionCols} ${UI.row(200)}`}>
              {unplaced.map((row) => (
                <FallbackCard key={row.output_id} row={row} title={def.titles?.[row.output_id] ?? row.output_id} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
