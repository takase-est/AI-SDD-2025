import { ActivityLog } from './types';

// 10 items of seed data in CSV format
export const CSV_SEED_DATA = `
title,author,publisher,publishedYear,isbn,status,isFavorite
こころ,夏目 漱石,岩波書店,1991,9784003101018,read,true
人間失格,太宰 治,新潮社,1952,9784101006014,read,true
ノルウェイの森 (上),村上 春樹,講談社,2004,9784062748915,read,false
嫌われる勇気,岸見 一郎,ダイヤモンド社,2013,9784478025819,reading,true
FACTFULNESS,ハンス・ロスリング,日経BP,2019,9784822289607,unread,false
サピエンス全史 (上),ユヴァル・ノア・ハラリ,河出書房新社,2016,9784309226712,unread,false
沈黙の春,レイチェル・カーソン,新潮社,1974,9784102074012,unread,false
7つの習慣,スティーブン・R・コヴィー,キングベアー出版,2013,9784863940246,read,true
星の王子さま,サン＝テグジュペリ,岩波書店,2000,9784001141269,read,true
銀河鉄道の夜,宮沢 賢治,新潮社,1989,9784101092055,reading,false
`;

export const ITEMS_PER_PAGE = 5;

const now = new Date();
const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);

// Ordered by new -> old
export const INITIAL_ACTIVITIES: ActivityLog[] = [
  {
    id: 'init-4',
    type: 'favorite',
    message: '「星の王子さま」をお気に入りに登録しました',
    timestamp: new Date(now.getTime() - 30 * 60 * 1000).toISOString()
  },
  {
    id: 'init-3',
    type: 'status',
    message: '「銀河鉄道の夜」の状態を更新しました (読書中)',
    timestamp: oneHourAgo.toISOString()
  },
  {
    id: 'init-2',
    type: 'import',
    message: '初期データをロードしました (10件)',
    timestamp: twoHoursAgo.toISOString()
  },
  {
    id: 'init-1',
    type: 'system',
    message: 'システムを初期化しました (Cyber Deck v2.1)',
    timestamp: twoHoursAgo.toISOString()
  }
];