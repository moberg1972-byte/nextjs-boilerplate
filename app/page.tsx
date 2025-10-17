// app/page.tsx
import { createClient } from '@supabase/supabase-js';
import { ChncCard, type ChncPayload } from './components/ChncCard';

type Row = {
  doc_id: string;
  output_id: string;             // "CMP.CHNC"
  content_json: ChncPayload;     // { rows: [...], preset_rows: [...] }
};

export default async function Page({ searchParams }: { searchParams?: { doc?: string } }) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const docId = searchParams?.doc; // optional: /?doc=YOUR_DOC_ID

  let query = supabase
    .from<Row>('vw_cmp_chnc')
    .select('doc_id,output_id,content_json')
    .order('updated_at', { ascending: false })
    .limit(1);

  if (docId) query = query.eq('doc_id', docId);

  const { data, error } = await query;
  if (error) return <pre>Failed to load: {error.message}</pre>;
  if (!data?.length) return <p>No CMP.CHNC found. Run your Execute workflow.</p>;

  const { doc_id, content_json } = data[0];

  return (
    <main style={{ padding: 24, maxWidth: 1100, margin: '0 auto' }}>
      <h1 style={{ marginTop: 0 }}>UA Cadence & Channels</h1>
      <p style={{ color: '#6b7280', marginTop: 4 }}>Doc: {doc_id}</p>
      <ChncCard title="Channels & Cadence (CMP.CHNC)" payload={content_json} />
    </main>
  );
}
