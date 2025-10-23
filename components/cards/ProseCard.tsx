// components/cards/ProseCard.tsx
import CardShell from './CardShell';
import type { Row } from '@/types/outputs';

function firstText(obj: any, keys: string[]): string | null {
  for (const k of keys) {
    const v = obj?.[k];
    if (typeof v === 'string' && v.trim()) return v.trim();
  }
  return null;
}

function bulletsToText(bullets: any[]): string {
  return bullets
    .filter((b) => typeof b?.text === 'string' && b.text.trim())
    .slice(0, 3)
    .map((b) => b.text.trim())
    .join(' • ');
}

function seedsToText(seeds: any[]): string {
  return seeds
    .filter((s) => typeof s?.phrase === 'string' && s.phrase.trim())
    .slice(0, 3)
    .map((s) => s.phrase.trim())
    .join(' • ');
}

function clustersToText(clusters: any[]): string {
  // e.g., [{name:'Marketing', members:[...]}]
  return clusters
    .filter((c) => typeof c?.name === 'string' && c.name.trim())
    .slice(0, 3)
    .map((c) => c.name.trim())
    .join(' • ');
}

function extractPreview(json: any, output_id: string): string {
  if (!json || typeof json !== 'object') return '';

  // 1) direct prose fields we’ve seen in your data
  const direct = firstText(json, ['paragraph', 'line', 'half_page', 'dossier', 'notes']);
  if (direct) return direct;

  // 2) bullets style
  if (Array.isArray(json.bullets) && json.bullets.length) {
    const s = bulletsToText(json.bullets);
    if (s) return s;
  }

  // 3) language seeds
  if (Array.isArray(json.seeds) && json.seeds.length) {
    const s = seedsToText(json.seeds);
    if (s) return s;
  }

  // 4) org map clusters/contacts summary
  if (Array.isArray(json.clusters) && json.clusters.length) {
    const s = clustersToText(json.clusters);
    if (s) return `Clusters: ${s}`;
  }
  if (Array.isArray(json.contacts) && json.contacts.length) {
    const names = json.contacts
      .map((c: any) => c?.name)
      .filter((n: any) => typeof n === 'string' && n.trim())
      .slice(0, 3)
      .join(', ');
    if (names) return `Contacts: ${names}`;
  }

  // 5) channels overview sometimes hides under pointer/paragraph combo
  if (json.pointer && json.paragraph) return json.paragraph;

  // 6) specific “gap” shape
  if (json.gap?.line) return json.gap.line;

  return '';
}

export default function ProseCard({ row, title }: { row: Row; title: string }) {
  const preview = extractPreview(row.content_json, row.output_id);
  return (
    <CardShell title={title} outputId={row.output_id} shadowless={row.output_id==='CMP.CHNC.CHANNELS'}>
      {preview
        ? <p className="w-full break-words whitespace-pre-line text-sm text-zinc-700 leading-6">{preview}</p>
        : <p className="text-sm text-zinc-400">No data yet.</p>
      }
    </CardShell>
  );
}
