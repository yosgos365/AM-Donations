const fs = require('fs');
let code = fs.readFileSync('src/components/UserDashboard.tsx', 'utf-8');

code = code.replace(
  "<span className=\"text-lg sm:text-xl font-semibold tracking-tight text-blue-900 whitespace-nowrap\">אחוות מנחם</span>",
  "<img src=\"https://raw.githubusercontent.com/yosgos365/AM-Donations/main/Logo.jpeg\" alt=\"אחוות מנחם\" className=\"w-10 h-10 rounded-full object-cover border border-stone-200\" />"
);

fs.writeFileSync('src/components/UserDashboard.tsx', code);
