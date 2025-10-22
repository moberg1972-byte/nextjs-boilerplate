// lib/layouts/pro.ts
import type { LaneDefinition } from '@/types/outputs';

export const PRO_DEF: LaneDefinition = {
  laneId: 'PRO',
  sections: [
    {
      title: 'OVERVIEW',
      rowHeight: 240,
      blocks: [], // add blocks when PRO data lands
    },
  ],
  cardMap: {},   // you can reuse CARD_BY_OUTPUT later if you want
  titles: {},
};
