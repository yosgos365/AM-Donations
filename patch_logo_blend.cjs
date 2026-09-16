const fs = require('fs');

// Patch Login.tsx
let loginCode = fs.readFileSync('src/components/Login.tsx', 'utf-8');
loginCode = loginCode.replace(
  /className="w-32 h-auto object-contain"/g,
  'className="w-32 h-auto object-contain mix-blend-multiply"'
);
fs.writeFileSync('src/components/Login.tsx', loginCode);

// Patch UserDashboard.tsx
let userDashCode = fs.readFileSync('src/components/UserDashboard.tsx', 'utf-8');
userDashCode = userDashCode.replace(
  /className="h-12 w-auto object-contain"/g,
  'className="h-12 w-auto object-contain mix-blend-multiply"'
);
fs.writeFileSync('src/components/UserDashboard.tsx', userDashCode);

// Patch AdminDashboard.tsx
let adminDashCode = fs.readFileSync('src/components/AdminDashboard.tsx', 'utf-8');
adminDashCode = adminDashCode.replace(
  /className="w-10 h-auto object-contain rounded"/g,
  'className="w-10 h-auto object-contain mix-blend-multiply"'
);
// Make sure AdminDashboard uses the no_text version too for consistency, or standard one if requested. He said "את הלוגו תדאג שיהיה בלי רקע"
// We'll update the AdminDashboard to use the mix-blend-multiply as well.
fs.writeFileSync('src/components/AdminDashboard.tsx', adminDashCode);

