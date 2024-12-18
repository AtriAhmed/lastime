// db.js
import Dexie from 'dexie';

export const db = new Dexie('lastTime');
db.version(1).stores({
  actions: '++id, name, date',
});
