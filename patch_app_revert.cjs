const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

// Remove handleImportBulkPledges block
const importRegex = /\s*const handleImportBulkPledges = \([\s\S]*?setPledges\(prev => \[\.\.\.newPledges, \.\.\.prev\]\);\n  };\n/g;
code = code.replace(importRegex, '');

// Remove onImportBulkPledges prop
code = code.replace(/\n\s*onImportBulkPledges=\{handleImportBulkPledges\}/g, '');

fs.writeFileSync('src/App.tsx', code);
