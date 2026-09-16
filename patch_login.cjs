const fs = require('fs');

let code = fs.readFileSync('src/components/Login.tsx', 'utf-8');

// Replace standard icon with Image logo
code = code.replace(
  "{isAdminMode ? <Lock className=\"w-12 h-12\" /> : <LogIn className=\"w-12 h-12\" />}",
  "<img src=\"https://raw.githubusercontent.com/yosgos365/AM-Donations/main/Logo.jpeg\" alt=\"אחוות מנחם\" className=\"w-24 h-24 rounded-full object-cover shadow-sm border-2 border-white\" />"
);

fs.writeFileSync('src/components/Login.tsx', code);
