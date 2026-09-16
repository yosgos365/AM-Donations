const fs = require('fs');
let code = fs.readFileSync('src/components/AdminDashboard.tsx', 'utf-8');

code = code.replace(
  "const [activeTab, setActiveTab] = useState<'pending' | 'add' | 'all' | 'users'>('pending');",
  "const [activeTab, setActiveTab] = useState<'pending' | 'add' | 'all' | 'users' | 'import'>('pending');\n  const [importText, setImportText] = useState('');\n  const [importError, setImportError] = useState('');\n  const [importSuccess, setImportSuccess] = useState('');"
);

fs.writeFileSync('src/components/AdminDashboard.tsx', code);
