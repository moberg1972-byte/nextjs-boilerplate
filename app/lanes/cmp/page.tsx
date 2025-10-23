// app/lanes/cmp/page.tsx
import LanePage from '@/lib/lanePage';
import { CMP_DEF } from '@/lib/layouts/cmp';
import RealtimeRefresher from '@/components/RealtimeRefresher';

export const revalidate = 0;
export const dynamic = 'force-dynamic';

export default function Page() {
  return (
    <>
      <RealtimeRefresher laneId="CMP" />
      <LanePage def={CMP_DEF} />
    </>
  );
}
