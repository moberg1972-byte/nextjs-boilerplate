// lib/lanePage.tsx
import { supabase } from '@/lib/supabase';
import type { LaneDefinition, Row } from '@/types/outputs';
import ProseCard from '@/components/cards/ProseCard';
import NameValueCard from '@/components/cards/NameValueCard';
import TableCard from '@/components/cards/TableCard';
import FallbackCard from '@/components/cards/FallbackCard';
import LaneBar from '@/components/chrome/LaneBar';   // <-- NEW

function prettifyId(id: string) {
  const parts = id.split('.');
  const last = parts[2] ?? id;
  return last.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
}

function spanClasses(b: { colSpan?: number; rowSpan?: number }) {
  const cls: string[] = ['min-h-0'];
  if (b.colSpan === 2) cls.push('md:col-span-2 xl:col-span-2');
  if (b.colSpan === 3) cls.push('md:col-span-3 xl:col-span-3');
  if (b.colSpan === 4) cls.push('xl:col-span-4');
  if (b.rowSpan === 2) cls.push('md:row-span-2 xl:row-span-2');
  if (b.rowSpan === 3) cls.push('md:row-span-3 xl:row-span-3');
  return cls.join(' ');
}

function kindFor(row: Row | undefined, def: LaneDefinition, b: any) {
  if (!row) return 'FALLBACK';
  const hint = row.card_type || def.cardMap?.[b.id] || 'PROSE';
  return String(hint).toUpperCase();
}

function renderCard(kind: string, row: Row | undefined, title: string, outputId: string) {
  if (!row) {
    const fallbackRow: Row = {
      doc_id: '',
      lane_id: '',
      job_id: '',
      output_id: outputId,
      content_json: null,
      card_type: 'FALLBACK',
    };
    return <FallbackCard row={fallbackRow} title={title} />;
  }

  // Heuristic: prose override for prose-like payloads on NAME_VALUE
  const cj: any = row.content_json || {};
  const proseLike = ['paragraph', 'line', 'half_page', 'dossier', 'items', 'rows']
    .some(k => typeof cj?.[k] === 'string' || Array.isArray(cj?.[k]));
  if (kind === 'NAME_VALUE' && proseLike) kind = 'PROSE';

  switch (kind) {
    case 'NAME_VALUE':
      return <NameValueCard row={row} title={title} />;
    case 'TABLE':
      // pass a shadowless hint via title wrapper (see CardShell change below)
      return <TableCard row={row} title={title} />;
    case 'PROSE':
    default:
      return <ProseCard row={row} title={title} />;
  }
}

export default async function LanePage({ def }: { def: LaneDefinition }) {
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

  const titleFor = (id: string) =>
    (byId[id]?.human_title?.trim()) || def.titles?.[id] || prettifyId(id);

  // UPDATED layout: wider outer padding, larger gaps, lighter shadows
 return (
  <main className="bg-zinc-100 min-h-screen">
    {/* Header now constrained to same width */}
    <div className="mx-auto max-w-screen-2xl px-5 md:px-8 xl:px-10 py-4 md:py-5">
      <LaneBar current={def.laneId} />
    </div>

    {/* Page content container (moderate, ~half the previous change) */}
    <div className="mx-auto max-w-screen-2xl px-5 md:px-8 xl:px-10 py-6 md:py-7">
      {def.sections.map((sec) => (
        <section key={sec.title} className="min-h-0">
          <h3 className="mt-6 mb-3 text-xs font-semibold tracking-wide text-zinc-600">
            {sec.title}
          </h3>

          <div
            className="grid gap-5 xl:gap-6 grid-cols-1 md:grid-cols-3 xl:grid-cols-6 min-h-0"
            style={{ gridAutoRows: `${sec.rowHeight}px` }}
          >
            {sec.blocks.map((b) => {
              const row = byId[b.id];
              const kind = kindFor(row, def, b);
              const title = titleFor(b.id);
              const span = spanClasses(b);

              const isTable = (row?.card_type ?? '').toUpperCase() === 'TABLE';
              const wrapperClass = isTable
                ? 'h-full'
                : 'h-full drop-shadow-[0_9px_22px_rgba(0,0,0,0.09)]'; // slightly lighter than original

              return (
                <div key={b.id} className={span}>
                  <div className={wrapperClass}>
                    {renderCard(kind, row, title, b.id)}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  </main>
);
}
