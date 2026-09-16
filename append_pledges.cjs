const fs = require('fs');

let dataFile = fs.readFileSync('src/data.ts', 'utf-8');

const newPledges = [
  { id: 'import_1', userId: '3322214dad8aa74e', type: 'מפטיר', amount: 700, date: '2026-09-12', status: 'open' },
  { id: 'import_2', userId: '3322214dad8aa74e', type: 'גלילה', amount: 150, date: '2026-09-13', status: 'open' },
  { id: 'import_3', userId: '7b287a1cdb1e06a7', type: 'שישי', amount: 400, date: '2026-09-12', status: 'open' },
  { id: 'import_4', userId: '1b66acbf19afd338', type: 'הגבהה', amount: 200, date: '2026-09-13', status: 'open' },
  { id: 'import_5', userId: '9b64c1be86f54734', type: 'גלילה', amount: 130, date: '2026-09-12', status: 'open' },
  { id: 'import_6', userId: '9b64c1be86f54734', type: 'גלילה', amount: 100, date: '2026-09-13', status: 'open' },
  { id: 'import_7', userId: '60d8c5fe0d323f4f', type: 'גלילה', amount: 150, date: '2026-09-12', status: 'open' },
  { id: 'import_8', userId: '5b253c8a233ea362', type: 'רביעי', amount: 600, date: '2026-09-13', status: 'open' },
  { id: 'import_9', userId: '0288d12c46cb9d75', type: 'לוי', amount: 100, date: '2026-09-12', status: 'open' },
  { id: 'import_10', userId: '96853730b0987aa2', type: 'שלישי', amount: 350, date: '2026-09-12', status: 'open' }
];

const pledgesStr = JSON.stringify(newPledges, null, 2);

// Let's replace the array assignment
// We can just find the end of the file.
// Or parse and reconstruct? No, it's a TS file with exports.
// Let's just do text manipulation safely.
dataFile = dataFile.trim();
if (dataFile.endsWith('];')) {
  dataFile = dataFile.slice(0, -2) + ",\n" + pledgesStr.slice(1, -1) + "\n];";
}

fs.writeFileSync('src/data.ts', dataFile);
