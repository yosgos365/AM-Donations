const fs = require('fs');
let code = fs.readFileSync('src/components/Login.tsx', 'utf-8');

// We need to import ArrowRight from lucide-react if not present, and update the button.
code = code.replace(
  "import { LogIn, Lock } from 'lucide-react';",
  "import { LogIn, Lock, ArrowRight } from 'lucide-react';"
);

const oldButton = `<button 
        onClick={() => { setIsAdminMode(!isAdminMode); setPhone(''); setPassword(''); }} 
        className="absolute top-6 left-6 flex items-center gap-2 text-stone-600 hover:text-blue-600 font-medium transition-colors"
      >
        <Lock className="w-5 h-5" />
        {isAdminMode ? 'כניסת לקוח' : 'כניסת מנהל'}
      </button>`;

const newButton = `<button 
        onClick={() => { setIsAdminMode(!isAdminMode); setPhone(''); setPassword(''); }} 
        className="absolute top-6 left-6 flex items-center gap-2 text-stone-600 hover:text-blue-600 font-medium transition-colors"
      >
        {isAdminMode ? <ArrowRight className="w-5 h-5" /> : <><Lock className="w-5 h-5" /> כניסת מנהל</>}
      </button>`;

code = code.replace(oldButton, newButton);

fs.writeFileSync('src/components/Login.tsx', code);
