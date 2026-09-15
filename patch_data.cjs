const fs = require('fs');

let dataFile = fs.readFileSync('src/data.ts', 'utf-8');

const demoPledges = [
  { id: 'p1', userId: 'demo_user_id', type: 'עליית מפטיר', amount: 180, date: '2026-09-01', status: 'open' },
  { id: 'p2', userId: 'demo_user_id', type: 'נדר לבית הכנסת', amount: 250, date: '2026-09-08', status: 'open' },
  { id: 'p3', userId: 'demo_user_id', type: 'עליית שלישי', amount: 200, date: '2026-07-15', status: 'open' },
  { id: 'p4', userId: 'demo_user_id', type: 'מכירת חמץ', amount: 50, date: '2026-04-10', status: 'paid', paymentMethod: 'paybox', paidAt: '2026-04-15', approvedAt: '2026-04-16', receiptNumber: '10001' },
  { id: 'p5', userId: 'demo_user_id', type: 'תרומה לקידוש', amount: 400, date: '2026-05-20', status: 'paid', paymentMethod: 'bank', paidAt: '2026-05-25', approvedAt: '2026-05-26', receiptNumber: '10002' }
];

dataFile = dataFile.replace(
  /export const initialPledges: Pledge\[\] = \[[\s\S]*?\];/,
  "export const initialPledges: Pledge[] = " + JSON.stringify(demoPledges, null, 2) + ";"
);

fs.writeFileSync('src/data.ts', dataFile);
