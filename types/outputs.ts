// types/outputs.ts
export type Row = {
  doc_id: string;
  lane_id: string;
  job_id: string;
  output_id: string;
  content_json: any;
  card_type?: 'PROSE' | 'NAME_VALUE' | 'TABLE' | 'FALLBACK' | null;
};

export type CardType = 'prose' | 'nameValue' | 'table' | 'fallback';

export type Placement = {
  id: string;                 // output_id
  colSpan?: number;           // default 1
  rowSpan?: number;           // default 1
};

export type SectionDef = {
  title: string;              // "ORGANISATION"
  rowHeight: number;          // e.g., 240, 336, 168
  cols?: 6;                   // keep 6 for all lanes
  blocks: Array<Placement>;   // in left→right order; we’ll map to grid
};

export type LaneDefinition = {
  laneId: 'CMP' | 'PRO' | string;
  sections: SectionDef[];
  cardMap: Record<string, CardType>;   // output_id -> card type
  titles?: Record<string, string>;     // optional friendly titles
};
