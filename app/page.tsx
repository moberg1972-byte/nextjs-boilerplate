import { ChncCard, type ChncPayload } from './components/ChncCard';

const sample: ChncPayload = {
  rows: [
    {"notes":"Monthly dev updates.","format":"News","pcl_id":null,"row_key":"YouTube","evidence":"E","platform":"YouTube","cadence_12m":12,"cadence_90d":3,"example_url":"https://www.youtube.com/watch?v=example1","example_date":"2023-09-15","timing_nouns":["Dev Diary","Update"],"audience_locus":"owned","cadence_phrase":"1/mo","channel_series":"Dev Diary"},
    {"notes":"Regular patch updates.","format":"Store/Blog","pcl_id":null,"row_key":"Steam","evidence":"E","platform":"Steam","cadence_12m":8,"cadence_90d":2,"example_url":"https://store.steampowered.com/news/app/example","example_date":"2023-08-10","timing_nouns":["Patch Notes","Update"],"audience_locus":"owned","cadence_phrase":"1–2/mo","channel_series":"N/A"},
    {"notes":"Occasional announcements.","format":"Announcements","pcl_id":null,"row_key":"PlayStation Blog","evidence":"E","platform":"PlayStation Blog","cadence_12m":5,"cadence_90d":1,"example_url":"https://blog.playstation.com/2023/07/20/example","example_date":"2023-07-20","timing_nouns":["Announcement"],"audience_locus":"owned","cadence_phrase":"1/mo","channel_series":"N/A"},
    {"notes":"Frequent updates and community engagement.","format":"Announcements","pcl_id":null,"row_key":"X","evidence":"E","platform":"X","cadence_12m":20,"cadence_90d":5,"example_url":"https://twitter.com/example/status/123456789","example_date":"2023-09-01","timing_nouns":["Update","Announcement"],"audience_locus":"community","cadence_phrase":"2–3/mo","channel_series":"N/A"}
  ],
  preset_rows: ["YouTube","Steam","PlayStation Blog","Xbox Wire","Nintendo News","Official Site","Blog","X","Instagram","Facebook","TikTok","Forum","Discord","Reddit"]
};

export default function Page() {
  return (
    <main style={{ padding: 24, maxWidth: 1100, margin: '0 auto' }}>
      <h1>UA Cadence & Channels</h1>
      <ChncCard title="Channels & Cadence (Sample)" payload={sample} />
    </main>
  );
}
