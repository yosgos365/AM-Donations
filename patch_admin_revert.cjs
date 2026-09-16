const fs = require('fs');
let code = fs.readFileSync('src/components/AdminDashboard.tsx', 'utf-8');

// 1. Remove from Props type
code = code.replace(/\s*onImportBulkPledges: \(rows: any\[\]\) => void;/g, '');

// 2. Remove from destructured props
code = code.replace(/, onImportBulkPledges \}: AdminDashboardProps/g, ' }: AdminDashboardProps');

// 3. Revert state declarations
code = code.replace(
  "const [activeTab, setActiveTab] = useState<'pending' | 'add' | 'all' | 'users' | 'import'>('pending');\n  const [importText, setImportText] = useState('');\n  const [importError, setImportError] = useState('');\n  const [importSuccess, setImportSuccess] = useState('');",
  "const [activeTab, setActiveTab] = useState<'pending' | 'add' | 'all' | 'users'>('pending');"
);

// 4. Remove handleImportSubmit function
const submitRegex = /\s*const handleImportSubmit = \(\) => \{[\s\S]*?catch \(err\) \{\n      setImportError\('שגיאה בתהליך הייבוא\.'\);\n    \}\n  \};\n/g;
code = code.replace(submitRegex, '');

// 5. Remove the "Import" tab button
const buttonRegex = /\s*<button\n\s*onClick=\{\(\) => setActiveTab\('import'\)\}[\s\S]*?<\/button>/;
code = code.replace(buttonRegex, '');

// 6. Remove the import UI block
const uiRegex = /\s*\{activeTab === 'import' && \([\s\S]*?\}\)\n/g;
code = code.replace(uiRegex, '\n');

fs.writeFileSync('src/components/AdminDashboard.tsx', code);
