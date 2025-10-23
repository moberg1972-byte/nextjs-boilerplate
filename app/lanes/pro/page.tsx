// app/lanes/pro/page.tsx
import LanePage from '@/lib/lanePage';
import { PRO_DEF } from '@/lib/layouts/pro';
import RealtimeRefresher from '@/components/RealtimeRefresher';

export const revalidate = 0;
export const dynamic = 'force-dynamic';

export default function Page() {
  return (
    <>
      <RealtimeRefresher laneId="PRO" />
      <LanePage def={PRO_DEF} />
    </>
  );
}
