const fs = require('fs');

// 1. Patch Login.tsx
let loginCode = fs.readFileSync('src/components/Login.tsx', 'utf-8');
loginCode = loginCode.replace(
  /<img src="https:\/\/raw\.githubusercontent\.com\/yosgos365\/AM-Donations\/main\/Logo\.jpeg"[\s\S]*?\/>/,
  '<img src="https://raw.githubusercontent.com/yosgos365/AM-Donations/main/Logo_no_text.jpeg" alt="אחוות מנחם" className="w-32 h-auto object-contain drop-shadow-md" />'
);
fs.writeFileSync('src/components/Login.tsx', loginCode);

// 2. Patch UserDashboard.tsx
let userDashCode = fs.readFileSync('src/components/UserDashboard.tsx', 'utf-8');
userDashCode = userDashCode.replace(
  /<img src="https:\/\/raw\.githubusercontent\.com\/yosgos365\/AM-Donations\/main\/Logo\.jpeg"[\s\S]*?\/>/,
  '<img src="https://raw.githubusercontent.com/yosgos365/AM-Donations/main/Logo_no_text.jpeg" alt="אחוות מנחם" className="h-12 w-auto object-contain" />'
);
fs.writeFileSync('src/components/UserDashboard.tsx', userDashCode);

// 3. Patch AdminDashboard.tsx (Optional: Add Logo if it's missing)
let adminDashCode = fs.readFileSync('src/components/AdminDashboard.tsx', 'utf-8');
adminDashCode = adminDashCode.replace(
  /<div className="bg-slate-800 p-2 rounded-lg">\s*<Users className="w-6 h-6 text-indigo-400" \/>\s*<\/div>/,
  '<div className="bg-slate-800 p-1 rounded-lg">\n              <img src="https://raw.githubusercontent.com/yosgos365/AM-Donations/main/Logo.jpeg" alt="אחוות מנחם" className="w-10 h-auto object-contain rounded" />\n            </div>'
);
fs.writeFileSync('src/components/AdminDashboard.tsx', adminDashCode);

