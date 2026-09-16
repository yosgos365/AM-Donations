const fs = require('fs');
let code = fs.readFileSync('src/components/Login.tsx', 'utf-8');

// Remove drop-shadow from logo
code = code.replace(
  /className="w-32 h-auto object-contain drop-shadow-md"/g,
  'className="w-32 h-auto object-contain"'
);

// Make "כניסת מנהל" smaller on mobile
code = code.replace(
  /<><Lock className="w-5 h-5" \/> כניסת מנהל<\/>/g,
  '<><Lock className="w-5 h-5" /> <span className="text-sm sm:text-base">כניסת מנהל</span></>'
);

fs.writeFileSync('src/components/Login.tsx', code);
