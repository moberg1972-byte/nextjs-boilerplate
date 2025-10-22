// app/(lanes)/pro/page.tsx
import { LanePage } from '@/lib/lanePage';
import { PRO_DEF } from '@/lib/layouts/pro'; // create similar to CMP_DEF

export default async function Page() {
  return <LanePage def={PRO_DEF} />;
}
