// app/page.tsx
import { supabase } from '@/lib/supabase';

type Row = {
  doc_id: string;
  lane_id: string;
  job_id: string;
  output_id: string;
  content_json: any;
};

const TITLE: Record<string, string> = {
  'CMP.TITL.LISTING': 'Game Title Listings',
  'CMP.ETHO.ESSAY': 'Company Ethos Essay',
  'CMP.ORGM.MAP': 'Organization Map & Contacts',
  'CMP.ORGM.LSEEDS': 'Language Seeds',
  'CMP.KCDC.PRIMARY': 'Primary Contact',
  'CMP.KCDC.SECOND': 'Secondary Contact', // (fixed name)
  'CMP.CHNC.OVERVIEW': 'Channels & Cadence Overview',
  'CMP.CHNC.CHANNELS': 'UA Channels Audit Table',
  'CMP.KCDC.CULTURE': 'Culture & Momentum',
  'CMP.KCDC.CLUSTER': 'Decision Cluster',
  'CMP.BCOT.POSE': 'Company Posture',
  'CMP.BCOT.STUB': '90-Day Event Stub',
  'CMP.BCOT.WHYN': 'Why Now?',
  'CMP.BCOT.UNKN': 'Unknowns to Carry',
  'CMP.BCOT.RISK': 'Risk Watchlist',
  'CMP.CHNC.TIMINGS': 'Timing-noun Sightings',
  'CMP.ORGM.GAP': 'Descriptive Gap Signal',
  'CMP.CHNC.GAP': 'Descriptive Gap Signal',
};

const PLACE: Record<string, { col: number; row: number; colSpan?: number; rowSpan?: number }> = {
  // Row 1
  'CMP.TITL.LISTING': { col: 1, row: 1 },
  'CMP.ETHO.ESSAY':   { col: 2, row: 1 },
  'CMP.ORGM.MAP':     { col: 3, row: 1 },
  'CMP.ORGM.LSEEDS':  { col: 4, row: 1 },
  'CMP.KCDC.PRIMARY': { col: 5, row: 1 },
  'CMP.KCDC.SECOND':  { col: 6, row: 1 },

  // Row 2
  'CMP.CHNC.OVERVIEW': { col: 1, row: 2 },
  'CMP.CHNC.CHANNELS': { col: 2, row: 2, colSpan: 3 },
  'CMP.KCDC.CULTURE':  { col: 5, row: 2 },
  'CMP.KCDC.CLUSTER':  { col: 6, row: 2 },

  // Row 3 (span two rows)
  'CMP.BCOT.POSE':    { col: 1, row: 3, rowSpan: 2 },
  'CMP.BCOT.STUB':    { col: 2, row: 3, rowSpan: 2 },
  'CMP.BCOT.WHYN':    { col: 3, row: 3, rowSpan: 2 },
  'CMP.BCOT.UNKN':    { col: 4, row: 3, rowSpan: 2 },
  'CMP.CHNC.TIMINGS': { col: 5, row: 3 },
  'CMP.ORGM.GAP':     { col: 6, row: 3 },

  // Row 4
  'CMP.BCOT.RISK': { col: 5, row: 4 },
  'CMP.CHNC.GAP':  { col: 6, row: 4 },
};

// Tailwind JIT-safe maps
const colStart = {1:'xl:col-start-1',2:'xl:col-start-2',3:'xl:col-start-3',4:'xl:col-start-4',5:'xl:col-start-5',6:'xl:col-start-6'} as const;
const rowStart = {1:'xl:row-start-1',2:'xl:row-start-2',3:'xl:row-start-3',4:'xl:row-start-4'} as const;
const colSpan  = {1:'',2:'xl:col-span-2',3:'xl:col-span-3',4:'xl:col-span-4',5:'xl:col-span-5',6:'xl:col-span-6'} as const;
const rowSpan  = {1:'',2:'xl:row-span-2',3:'xl:row-span-3',4:'xl:row-span-4'} as const;

function areaClasses(id: string) {
  const p = PLACE[id];
  if (!p) return 'xl:col-span-2';
  const cs = p.colSpan ?? 1, rs = p.rowSpan ?? 1;
  return [
    'h-full',
    colStart[p.col as 1|2|3|4|5|6],
    rowStart[p.row as 1|2|3|4],
    colSpan[cs as 1|2|3|4|5|6],
    rowSpan[rs as 1|2|3|4],
  ].join(' ');
}

function Card({ row }: { row: Row }) {
  const title = TITLE[row.output_id] ?? row.output_id;
  const preview =
    row.content_json?.paragraph ??
    row.content_json?.line ??
    (Array.isArray(row.content_json?.bullets) ? row.content_json.bullets.map((b:any)=>b.text).slice(0,2).join(' • ') : '');

  return (
    <div className="rounded-2xl border p-4 shadow-sm bg-white h-full flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="text-base font-semibold leading-tight">{title}</h3>
          <p className="text-xs text-zinc-500">{row.job_id}</p>
        </div>
      </div>
      <p className="text-sm text-zinc-700 line-clamp-6">{preview}</p>
    </div>
  );
}

export default async function Page({
  searchParams,
}: { searchParams?: { doc_id?: string } }) {
  const docId = searchParams?.doc_id; // optional
  const q = supabase.from('v_instruction_outputs') // or 'v_instruction_outputs_cmp'
    .select('doc_id,lane_id,job_id,output_id,content_json')
    .eq('lane_id','CMP')
    .order('output_id', { ascending: true });

  const { data, error } = docId ? await q.eq('doc_id', docId) : await q;
  if (error) {
    return <pre className="p-8 text-sm text-red-600">Supabase error: {error.message}</pre>;
  }

  // Sort by our desired layout so the map is stable even if rows are missing
  const ordered = Object.keys(PLACE).map(k => data?.find(d => d.output_id === k)).filter(Boolean) as Row[];
  const unseen   = (data ?? []).filter(d => !PLACE[d.output_id]); // extras fall below

  return (
    <main className="min-h-screen bg-gradient-to-b from-zinc-100 to-white">
      <div className="max-w-[1400px] mx-auto px-4 py-10">
        <header className="mb-6">
          <h1 className="text-2xl font-bold">UA Cadence & Company</h1>
          <p className="text-zinc-600">Live CMP data from Supabase. 6-column placed grid.</p>
        </header>

        {/* Placed grid */}
        <div className="grid gap-4 grid-cols-1 md:grid-cols-3 xl:grid-cols-6 xl:auto-rows-[240px]">
          {ordered.map((row) => (
            <div key={row.output_id} className={areaClasses(row.output_id)}>
              <Card row={row} />
            </div>
          ))}
        </div>

        {/* Any outputs we didn’t plan for (safe fallback) */}
        {unseen.length > 0 && (
          <>
            <h2 className="mt-10 mb-3 text-sm font-semibold text-zinc-500">Unplaced</h2>
            <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
              {unseen.map(row => (
                <Card key={row.output_id} row={row} />
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
