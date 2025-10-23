// components/chrome/LaneBar.tsx
import Link from 'next/link';

const LANES = ['CMP','PRO','DEL','REC','ANA','PRJ','UAP','CRR','MPR','BUR'] as const;
const LANE_NAME: Record<string,string> = {
  CMP: 'Company', PRO: 'Production', DEL: 'Delivery', REC: 'Research',
  ANA: 'Analysis', PRJ: 'Projects', UAP: 'UA/Perf', CRR: 'Creator',
  MPR: 'Media/PR', BUR: 'Bureau'
};

export default function LaneBar({ current }: { current: string }) {
  return (
    <div className="mb-4 flex items-end justify-between">
      <h1 className="text-5xl font-extrabold tracking-tight text-zinc-800">
        {LANE_NAME[current] ?? current}
      </h1>
      <div className="flex items-center gap-6">
        <div className="flex flex-wrap gap-2">
          {LANES.map(id => {
            const active = id === current;
            return (
              <Link
                key={id}
                href={`/lanes/${id.toLowerCase()}`} // adjust if your route differs
                className={[
                  'rounded-full px-3.5 py-1.5 text-xs font-semibold',
                  active
                    ? 'bg-zinc-900 text-white shadow'
                    : 'bg-white text-zinc-700 hover:bg-zinc-100 shadow-sm'
                ].join(' ')}
              >
                {id}
              </Link>
            );
          })}
        </div>
        <div className="text-5xl font-extrabold tracking-tight text-zinc-900">OracleOS®</div>
      </div>
    </div>
  );
}
