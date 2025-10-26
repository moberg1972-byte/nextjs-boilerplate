// lib/layouts/pro.ts
import type { LaneDefinition } from '@/types/outputs';

export const PRO_DEF: LaneDefinition = {
  laneId: 'PRO',
  sections: [
    {
      title: 'CARRIERS',
      rowHeight: 300,
      blocks: [
        { id: 'PRO.GMOV.WORLD' },               // World synth (prose)
        { id: 'PRO.GMOV.PLAYERS' },             // Player POV (prose)
        { id: 'PRO.GMOV.FEELS' },               // Feel targets (prose)
        { id: 'PRO.GMOV.DIRECTOR' },            // Movement Director (prose)
        { id: 'PRO.GMOV.MOTIF', colSpan: 2 },   // Motif map (table)
      ],
    },
    {
      title: 'GAME MOVEMENT',
      rowHeight: 320,
      blocks: [
        { id: 'PRO.NCSP.DIRECTOR' },                          // Spine Director (prose)
        { id: 'PRO.NCSP.SPINE' },                             // Narrative spine (prose)
        { id: 'PRO.CARR.CHR', colSpan: 2 },                   // Characters (table)
        { id: 'PRO.CARR.WRL', colSpan: 2 },                   // Worlds / locales (table)
      ],
    },
    {
      title: 'SPINE & ETHOS',
      rowHeight: 300,
      blocks: [        
        { id: 'PRO.ETHO.TITLE' },                             // Title ethos (prose)
        { id: 'PRO.CARR.DIRECTOR' },                          // Carrier Director (prose)      
        { id: 'PRO.CARR.OBJ', colSpan: 2 },                   // Objects (table)
        { id: 'PRO.CARR.ROU', colSpan: 2 },                   // Routines (table)  
      ],
    },
  ],
  cardMap: {}, // DB card_type drives rendering; this is optional

  titles: {
    'PRO.CARR.CHR'      : 'Carrier · Characters',
    'PRO.CARR.OBJ'      : 'Carrier · Objects',
    'PRO.CARR.WRL'      : 'Carrier · Worlds',
    'PRO.CARR.ROU'      : 'Carrier · Routines',
    'PRO.CARR.DIRECTOR' : 'Carrier Director',
    'PRO.GMOV.WORLD'    : 'Game Movement · World',
    'PRO.GMOV.PLAYERS'  : 'Game Movement · Players',
    'PRO.GMOV.FEELS'    : 'Game Movement · Feels',
    'PRO.GMOV.MOTIF'    : 'Motif & Symbols',
    'PRO.GMOV.DIRECTOR' : 'Movement Director',
    'PRO.NCSP.SPINE'    : 'Narrative Core Spine',
    'PRO.NCSP.DIRECTOR' : 'Spine Director',
    'PRO.ETHO.TITLE'    : 'Title Ethos',
  },
};
