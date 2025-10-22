// app/(lanes)/cmp/page.tsx
import { LanePage } from '@/lib/lanePage';
import { CMP_DEF } from '@/lib/layouts/cmp';

export default async function Page() {
  return <LanePage def={CMP_DEF} />;
}
