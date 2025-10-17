import { createClient } from '@supabase/supabase-js';
import { ChncCard, type ChncPayload } from './components/ChncCard';
import { EssayCard } from './components/EssayCard';

type ChncRow  = { doc_id: string; output_id: string; content_json: ChncPayload };
type EssayRow = { doc_id: string; output_id: string; content_json: any };

export default async function Page({ searchParams }: { searchParams?: { doc?: string } }) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const supabase = createClient(url, key);
  const docId = searchParams?.doc;

  // fetch CMP.CHNC.CHANNELS
  let q1 = supabase.from('vw_cmp_chnc').select('doc_id,output_id,content_json');
  if (docId) q1 = q1.eq('doc_id', docId);
  const { data: chncRows, error: e1 } = await q1.order('doc_id', { ascending: false }).limit(1).returns<ChncRow[]>();

  // fetch CMP.ETHO.ESSAY
  let q2 = supabase.from('vw_cmp_etho_essay').select('doc_id,output_id,content_json');
  if (docId) q2 = q2.eq('doc_id', docId);
  const { data: essayRows, error: e2 } = await q2.order('doc_id', { ascending: false }).limit(1).returns<EssayRow[]>();

  const usingSupabase = !!url && !!key;

  return (
    <main style={{ padding: 24, maxWidth: 1100, margin: '0 auto' }}>
      <h1 style={{ marginTop: 0 }}>UA Cadence & Channels + Ethos Essay</h1>
      <p style={{ color: '#6b7280' }}>
        Data source: {usingSupabase ? 'Supabase live ✅' : 'Sample 🧪'}
        {(e1 || e2) ? ` · ${e1?.message ?? ''} ${e2?.message ?? ''}` : ''}
      </p>

      {/* Card #1: CMP.CHNC.CHANNELS */}
      {chncRows?.length ? (
        <ChncCard title="Channels & Cadence (CMP.CHNC.CHANNELS)" payload={chncRows[0].content_json} />
      ) : (
        <p>No CMP.CHNC.CHANNELS found for this doc.</p>
      )}

      <div style={{ height: 20 }} />

      {/* Card #2: CMP.ETHO.ESSAY */}
      {essayRows?.length ? (
        <EssayCard title="Company Ethos (CMP.ETHO.ESSAY)" payload={essayRows[0].content_json} />
      ) : (
        <p>No CMP.ETHO.ESSAY found for this doc.</p>
      )}
    </main>
  );
}
