// lib/layouts/cmp.ts
import type { LaneDefinition } from '@/types/outputs';
import { CARD_BY_OUTPUT } from '@/lib/cards';

export const CMP_DEF: LaneDefinition = {
  laneId: 'CMP',
  sections: [
    {
      title: 'ORGANISATION',
      rowHeight: 240,
      blocks: [
        { id:'CMP.TITL.LISTING' },
        { id:'CMP.ETHO.ESSAY' },
        { id:'CMP.ORGM.MAP' },
        { id:'CMP.ORGM.LSEEDS' },
        { id:'CMP.KCDC.PRIMARY' },
        { id:'CMP.KCDC.SECOND' },
      ],
    },
    {
      title: 'CHANNELS',
      rowHeight: 336,
      blocks: [
        { id:'CMP.CHNC.OVERVIEW' },
        { id:'CMP.CHNC.CHANNELS', colSpan: 3 },
        { id:'CMP.KCDC.CULTURE' },
        { id:'CMP.KCDC.CLUSTER' },
      ],
    },
    {
      title: 'BUSINESS',
      rowHeight: 168,
      blocks: [
        { id:'CMP.BCOT.POSE', rowSpan: 2 },
        { id:'CMP.BCOT.STUB', rowSpan: 2 },
        { id:'CMP.BCOT.WHYN', rowSpan: 2 },
        { id:'CMP.BCOT.UNKN', rowSpan: 2 },
        { id:'CMP.CHNC.TIMINGS' },
        { id:'CMP.ORGM.GAP' },
        { id:'CMP.BCOT.RISK' },
        { id:'CMP.CHNC.GAP' },
      ],
    },
  ],
  cardMap: CARD_BY_OUTPUT, // can be extended/overridden per lane
  titles: {
    'CMP.TITL.LISTING': 'Game Title Listings',
    // ... (optional — you already have one)
  },
};
