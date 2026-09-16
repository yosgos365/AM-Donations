const fs = require('fs');

const files = [
  'src/components/UserDashboard.tsx',
  'src/components/AdminDashboard.tsx'
];

files.forEach(file => {
  let code = fs.readFileSync(file, 'utf-8');
  code = code.replace(/קבלה/g, 'אישור תשלום');
  code = code.replace(/קבלות/g, 'אישורי תשלום');
  fs.writeFileSync(file, code);
});
