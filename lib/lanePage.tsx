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
  content_json: any;
  card_type: string | null;
  human_title: string | null;
};

function spanClasses(b: { colSpan?: number; rowSpan?: number }) {
  const cls: string[] = ['min-h-0'];
  
  // Must use explicit Tailwind classes (not template strings)
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
    // Create a minimal fallback row
    const fallbackRow: Row = {
      doc_id: '',
      lane_id: '',
      job_id: '',
      output_id: outputId,
      content_json: null,
      card_type: null,
      human_title: title,
    };
    return <FallbackCard row={fallbackRow} title={title} />;
  }
  
  // Heuristic: if DB says NAME_VALUE but payload is prose-only, switch to PROSE
  const cj = row.content_json || {};
  const proseLike = ['paragraph', 'line', 'half_page', 'dossier'].some(
    k => typeof cj?.[k] === 'string'
  );
  if (kind === 'NAME_VALUE' && proseLike) kind = 'PROSE';
  
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

export default async function LanePage({ def }: { def: LaneDefinition }) {
  const { data, error } = await supabase
    .from('v_instruction_outputs_v2')
    .select('doc_id,lane_id,job_id,output_id,content_json,card_type,human_title')
    .eq('lane_id', def.laneId)
    .order('output_id', { ascending: true });

  if (error) {
    return (
      <pre className="p-4 text-sm text-red-600">
        Supabase error: {error.message}
      </pre>
    );
  }

  const rows = (data ?? []) as Row[];
  const byId: Record<string, Row> = {};
  for (const r of rows) byId[r.output_id] = r;

  return (
    <main className="px-6 py-6">
      {def.sections.map((sec) => (
        <section key={sec.title} className="min-h-0">
          <h3 className="mt-8 mb-3 text-xs font-semibold tracking-wide text-zinc-500">
            {sec.title}
          </h3>
          <div
            className="grid gap-4 grid-cols-1 md:grid-cols-3 xl:grid-cols-6 min-h-0"
            style={{ gridAutoRows: `${sec.rowHeight}px` }}
          >
            {sec.blocks.map((b) => {
  const row = byId[b.id];
  const kind = kindFor(row, def, b);
  const title = row?.human_title ?? def.titles?.[b.id] ?? b.id;
  const span = spanClasses(b);
  
  return (
    <div key={b.id} className={span}>
      <div className="h-full">
        {renderCard(kind, row, title, b.id)}
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
