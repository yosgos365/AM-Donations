const fs = require('fs');
let code = fs.readFileSync('src/components/AdminDashboard.tsx', 'utf-8');

// Add Logo to Header
code = code.replace(
  "<div className=\"w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center\">\n            <Users className=\"w-5 h-5 text-indigo-600\" />\n          </div>",
  "<img src=\"https://raw.githubusercontent.com/yosgos365/AM-Donations/main/Logo.jpeg\" alt=\"אחוות מנחם\" className=\"w-10 h-10 rounded-lg object-cover border border-indigo-100\" />"
);

fs.writeFileSync('src/components/AdminDashboard.tsx', code);
