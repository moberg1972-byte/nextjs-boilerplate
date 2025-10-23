import CardShell from './CardShell';
import type { Row } from '@/types/outputs';

export default function TableCard({ row, title }: { row: Row; title: string }) {
  const cj: any = row?.content_json ?? {};
  const headers: string[] = Array.isArray(cj.headers) ? cj.headers : [];
  const rows: any[][] = Array.isArray(cj.rows) ? cj.rows : [];

  return (
    <CardShell title={title} outputId={row.output_id} variant="flat">
      {rows.length === 0 ? (
        <p className="text-sm text-zinc-400">No data yet.</p>
      ) : (
        <div className="overflow-auto">
          <table className="w-full text-sm">
            {headers.length > 0 && (
              <thead className="sticky top-0 bg-white">
                <tr>
                  {headers.map((h) => (
                    <th key={h} className="px-2 py-1 text-left font-medium text-zinc-600">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody>
              {rows.map((r, i) => (
                <tr key={i} className="border-t">
                  {r.map((cell, j) => (
                    <td key={j} className="px-2 py-1 align-top text-zinc-700">
                      {String(cell ?? '')}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </CardShell>
  );
}
