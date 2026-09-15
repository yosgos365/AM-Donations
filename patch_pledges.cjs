const fs = require('fs');
let dataFile = fs.readFileSync('src/data.ts', 'utf-8');

const demoPledges = [
  { id: 'p1', userId: 'demo_user_id', type: 'עליית מפטיר', amount: 180, date: '2026-09-01', status: 'open' },
  { id: 'p2', userId: 'demo_user_id', type: 'נדר לבית הכנסת', amount: 250, date: '2026-09-08', status: 'open' },
  { id: 'p3', userId: 'demo_user_id', type: 'עליית שלישי', amount: 200, date: '2026-07-15', status: 'open' }
];

dataFile = dataFile.replace(
  /export const initialPledges: Pledge\[\] = \[[\s\S]*?\];/,
  "export const initialPledges: Pledge[] = " + JSON.stringify(demoPledges, null, 2) + ";"
);

fs.writeFileSync('src/data.ts', dataFile);
