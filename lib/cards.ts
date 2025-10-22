// lib/cards.ts
import type { CardType } from '@/types/outputs';

export const CARD_BY_OUTPUT: Record<string, CardType> = {
  // CMP examples
  'CMP.TITL.LISTING': 'nameValue',
  'CMP.ETHO.ESSAY': 'prose',
  'CMP.ORGM.MAP': 'prose',
  'CMP.ORGM.LSEEDS': 'prose',
  'CMP.KCDC.PRIMARY': 'prose',
  'CMP.KCDC.SECOND': 'prose',
  'CMP.CHNC.OVERVIEW': 'prose',
  'CMP.CHNC.CHANNELS': 'table',
  'CMP.KCDC.CULTURE': 'prose',
  'CMP.KCDC.CLUSTER': 'prose',
  'CMP.BCOT.POSE': 'prose',
  'CMP.BCOT.STUB': 'prose',
  'CMP.BCOT.WHYN': 'prose',
  'CMP.BCOT.UNKN': 'prose',
  'CMP.BCOT.RISK': 'prose',
  'CMP.CHNC.TIMINGS': 'prose',
  'CMP.ORGM.GAP': 'prose',
  'CMP.CHNC.GAP': 'prose',
};
