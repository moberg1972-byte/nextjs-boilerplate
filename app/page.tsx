// app/page.tsx
import { createClient } from '@supabase/supabase-js';

type Row = {
  doc_id: string;
  lane_id: string;
  job_id: string;
  output_id: string;
  content_json: any;
};

// Human-friendly titles
const TITLE: Record<string, string> = {
  'CMP.TITL.LISTING': 'Game Title Listings',
  'CMP.ETHO.ESSAY': 'Company Ethos Essay',
  'CMP.ORGM.MAP': 'Organization Map & Contacts',
  'CMP.ORGM.LSEEDS': 'Language Seeds',
  'CMP.KCDC.PRIMARY': 'Primary Contact',
  'CMP.KCDC.SECOND': 'Secondary Contact',
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

// IDs per section
const ORG = [
  'CMP.TITL.LISTING',
  'CMP.ETHO.ESSAY',
  'CMP.ORGM.MAP',
  'CMP.ORGM.LSEEDS',
  'CMP.KCDC.PRIMARY',
  'CMP.KCDC.SECOND',
] as const;

const CHN = [
  'CMP.CHNC.OVERVIEW',
  'CMP.CHNC.CHANNELS', // spans 3 cols
  'CMP.KCDC.CULTURE',
  'CMP.KCDC.CLUSTER',
] as const;

const BUS = [
  // Rows 3 + 4 combined (BCOT x4 span 2 rows)
  'CMP.BCOT.POSE',
  'CMP.BCOT.STUB',
  'CMP.BCOT.WHYN',
  'CMP.BCOT.UNKN',
  // Row 3 right
  'CMP.CHNC.TIMINGS',
  'CMP.ORGM.GAP',
  // Row 4 right
  'CMP.BCOT.RISK',
  'CMP.CHNC.GAP',
] as const;

function Section({ title }: { title: string }) {
  return (
    <div className="mt-8 mb-3">
      <div className="text-xs font-semibold tracking-wider text-zinc-500">{title}</div>
      <div className="mt-2 border-t border-zinc-200" />
    </div>
  );
}

function Card({ row }: { row: Row }) {
  const title = TITLE[row.output_id] ?? row.output_id;
  const preview =
    row.content_json?.paragraph ??
    row.content_json?.line ??
    (Array.isArray(row.content_json?.bullets)
      ? row.content_json.bullets.map((b: any) => b.text).slice(0, 2).join(' • ')
      : '');

  // Special style: Channels table sits “on background” (no shadow)
  const shadowless = row.output_id === 'CMP.CHNC.CHANNELS';

  return (
    <div
      className={[
        'h-full rounded-2xl bg-white',
        shadowless ? '' : 'shadow-lg',
        'p-4 flex flex-col',
      ].join(' ')}
    >
      <div className="mb-1">
        <h3 className="text-base font-semibold leading-tight">{title}</h3>
        {/* show output_id under the title */}
        <p className="text-[11px] tracking-wide text-zinc-500">{row.output_id}</p>
      </div>
      <p className="text-sm text-zinc-700 line-clamp-6">{preview}</p>
    </div>
  );
}

function pick(map: Record<string, Row>, ids: readonly string[]) {
  return ids.map((id) => map[id]).filter(Boolean) as Row[];
}

export default async function Page({
  searchParams,
}: {
  searchParams?: { doc_id?: string };
}) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const base = supabase
    .from('v_instruction_outputs_v2') // <-- use your real view/table name
    .select('doc_id,lane_id,job_id,output_id,content_json')
    .eq('lane_id', 'CMP')
    .order('output_id', { ascending: true });

  const { doc_id } = searchParams ?? {};
  const { data, error } = doc_id ? await base.eq('doc_id', doc_id) : await base;
  if (error) {
    return (
      <pre className="p-8 text-sm text-red-600">
        Supabase error: {error.message}
      </pre>
    );
  }

  const byId = Object.fromEntries((data ?? []).map((r) => [r.output_id, r]));
  const org = pick(byId, ORG);
  const chn = pick(byId, CHN);
  const bus = pick(byId, BUS);

  return (
    <main className="min-h-screen bg-zinc-100">
      <div className="mx-auto px-4 py-10 max-w-[1960px]">
        <header className="mb-6">
          <h1 className="text-2xl font-bold">UA Cadence & Company</h1>
          <p className="text-zinc-600">Live CMP data from Supabase. 3 sectioned grids (6-col).</p>
        </header>

        {/* ORGANISATION */}
        <Section title="ORGANISATION" />
        <div className="grid gap-4 grid-cols-1 md:grid-cols-3 xl:grid-cols-6 xl:auto-rows-[240px]">
          {org.map((row) => (
            <Card key={row.output_id} row={row} />
          ))}
        </div>

        {/* CHANNELS */}
        <Section title="CHANNELS" />
        <div className="grid gap-4 grid-cols-1 md:grid-cols-3 xl:grid-cols-6 xl:auto-rows-[336px]">
          {chn.map((row) => {
            const span =
              row.output_id === 'CMP.CHNC.CHANNELS' ? 'xl:col-span-3' : '';
            return (
              <div key={row.output_id} className={span}>
                <Card row={row} />
              </div>
            );
          })}
        </div>

        {/* BUSINESS */}
        <Section title="BUSINESS" />
        <div className="grid gap-4 grid-cols-1 md:grid-cols-3 xl:grid-cols-6 xl:auto-rows-[168px]">
          {bus.map((row) => {
            const span =
              row.output_id === 'CMP.BCOT.POSE' ||
              row.output_id === 'CMP.BCOT.STUB' ||
              row.output_id === 'CMP.BCOT.WHYN' ||
              row.output_id === 'CMP.BCOT.UNKN'
                ? 'xl:row-span-2'
                : '';
            return (
              <div key={row.output_id} className={span}>
                <Card row={row} />
              </div>
            );
          })}
        </div>

        {/* Unplaced (anything not in our section maps) */}
        {data && data.length > 0 && (
          <>
            const planned = new Set([...ORG, ...CHN, ...BUS]);
            const unplaced = (data as Row[]).filter((r) => !planned.has(r.output_id));
          </>
        )}
      </div>
    </main>
  );
}
