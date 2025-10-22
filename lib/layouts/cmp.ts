// lib/layouts/cmp.ts
import type { LaneDefinition } from '@/types/outputs';
import { CARD_BY_OUTPUT } from '@/lib/cards';

export const CMP_DEF: LaneDefinition = {
  laneId: 'CMP',
  sections: [
    {
      title: 'ORGANISATION',
      rowHeight: 280,
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
  rowHeight: 220,
  blocks: [
    // span 2 rows each:
    { id: 'CMP.BCOT.POSE',   colSpan: 1, rowSpan: 2 },
    { id: 'CMP.BCOT.STUB',   colSpan: 1, rowSpan: 2 },
    { id: 'CMP.BCOT.WHYN',   colSpan: 1, rowSpan: 2 },

    // single-row cards:
    { id: 'CMP.BCOT.UNKN',   colSpan: 1, rowSpan: 1 },
    { id: 'CMP.CHNC.TIMINGS',colSpan: 1, rowSpan: 1 },
    { id: 'CMP.ORGM.GAP',    colSpan: 1, rowSpan: 1 },
    { id: 'CMP.BCOT.RISK',   colSpan: 1, rowSpan: 1 },
    { id: 'CMP.CHNC.GAP',    colSpan: 1, rowSpan: 1 },
  ],
    },
  ],
  cardMap: CARD_BY_OUTPUT, // can be extended/overridden per lane
  titles: {
    'CMP.TITL.LISTING': 'Game Title Listings',
    // ... (optional — you already have one)
  },
};
