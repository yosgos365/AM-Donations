const fs = require('fs');

let dataFile = fs.readFileSync('src/data.ts', 'utf-8');

const demoUser = {
  id: "demo_user_id",
  phone: "0521234567",
  name: "ישראל ישראלי (דמו)",
  role: "user"
};

dataFile = dataFile.replace(
  /(\{\s*"id":\s*"admin_user_id"[\s\S]*?\},)/,
  "$1\n  " + JSON.stringify(demoUser, null, 2) + ","
);

const demoPledges = [
  { id: 'p1', userId: 'demo_user_id', type: 'עליית מפטיר', amount: 180, date: '2026-09-01', status: 'open' },
  { id: 'p2', userId: 'demo_user_id', type: 'נדר לבית הכנסת', amount: 250, date: '2026-09-08', status: 'pending', paymentMethod: 'paybox', receiptImage: 'אסמכתא.jpg', paidAt: '2026-09-14' },
  { id: 'p3', userId: 'demo_user_id', type: 'עליית שלישי', amount: 200, date: '2026-07-15', status: 'paid', paymentMethod: 'bank', receiptImage: 'אסמכתא.jpg', paidAt: '2026-07-20', approvedAt: '2026-07-21', receiptNumber: '10005' },
];

dataFile = dataFile.replace(
  /export const initialPledges: Pledge\[\] = \[\];/,
  "export const initialPledges: Pledge[] = " + JSON.stringify(demoPledges, null, 2) + ";"
);

fs.writeFileSync('src/data.ts', dataFile);
