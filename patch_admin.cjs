const fs = require('fs');
let code = fs.readFileSync('src/components/AdminDashboard.tsx', 'utf-8');

// Update props
code = code.replace(
  "onAddUser: (name: string, phone: string) => void;",
  "onAddUser: (name: string, phone: string) => void;\n  onImportBulkPledges: (rows: any[]) => void;"
);

// Destructure onImportBulkPledges
code = code.replace(
  "onAddUser }: AdminDashboardProps",
  "onAddUser, onImportBulkPledges }: AdminDashboardProps"
);

// activeTab type
code = code.replace(
  "const [activeTab, setActiveTab] = useState<'pending' | 'all' | 'add' | 'users'>('pending');",
  "const [activeTab, setActiveTab] = useState<'pending' | 'all' | 'add' | 'users' | 'import'>('pending');\n  const [importText, setImportText] = useState('');\n  const [importError, setImportError] = useState('');\n  const [importSuccess, setImportSuccess] = useState('');"
);

// Add Tab Button
const tabButton = `
          <button
            onClick={() => setActiveTab('import')}
            className={\`px-4 py-2 text-sm font-medium transition-colors flex items-center gap-2 rounded-md whitespace-nowrap \${
              activeTab === 'import' ? 'bg-stone-100 text-stone-900' : 'text-stone-500 hover:text-stone-700'
            }\`}
          >
            <Download className="w-4 h-4" />
            ייבוא נתונים
          </button>
`;
code = code.replace(
  "<button\n            onClick={() => setActiveTab('add')}",
  tabButton + "\n          <button\n            onClick={() => setActiveTab('add')}"
);

// Add parse logic
const importLogic = `
  const handleImportSubmit = () => {
    setImportError('');
    setImportSuccess('');
    
    if (!importText.trim()) {
      setImportError('נא להדביק נתונים לייבוא.');
      return;
    }
    
    try {
      const rows = importText.trim().split('\\n').map(r => r.trim()).filter(Boolean);
      const parsedRows = [];
      let skipped = 0;
      
      // Skip header row if it exists (check if first row contains 'שם' or 'טלפון')
      const startIndex = rows[0].includes('טלפון') ? 1 : 0;
      
      for (let i = startIndex; i < rows.length; i++) {
        // Handle both tab-separated and comma-separated
        const cols = rows[i].split(/[\\t,]+/).map(c => c.trim()).filter(Boolean);
        
        if (cols.length >= 5) {
          const name = cols[0];
          const type = cols[1];
          // date is index 2, phone index 3, amount index 4
          const dateStr = cols[2];
          const phone = cols[3];
          
          // Parse amount (remove ₪, whitespace, commas)
          let amountStr = cols[4];
          amountStr = amountStr.replace(/[^\\d.]/g, '');
          const amount = parseFloat(amountStr);
          
          if (!name || !phone || isNaN(amount)) {
            skipped++;
            continue;
          }
          
          parsedRows.push({
            name,
            type,
            date: new Date().toISOString(), // Fallback or convert Hebrew date later if needed. For now just current date as requested by standard behavior.
            phone,
            amount
          });
        } else {
          skipped++;
        }
      }
      
      if (parsedRows.length === 0) {
        setImportError('לא נמצאו נתונים תקינים לייבוא. ודא שהפורמט נכון.');
        return;
      }
      
      onImportBulkPledges(parsedRows);
      setImportSuccess(\`בהצלחה! יובאו \${parsedRows.length} התחייבויות.\${skipped > 0 ? \` (\${skipped} שורות דולגו)\` : ''}\`);
      setImportText('');
    } catch (err) {
      setImportError('שגיאה בתהליך הייבוא.');
    }
  };
`;
code = code.replace(
  "const handleAddSubmit",
  importLogic + "\n  const handleAddSubmit"
);

// Add Tab UI
const importUI = `
          {activeTab === 'import' && (
            <div className="p-8 max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-slate-800 mb-6 border-b border-slate-100 pb-4">ייבוא מאקסל / קובץ טקסט</h2>
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-800">
                  <p className="font-bold mb-2">פורמט נדרש:</p>
                  <p>הדבק לכאן את הנתונים ישירות מהאקסל. העמודות צריכות להיות בסדר הבא:</p>
                  <code className="block bg-white p-2 mt-2 rounded border border-blue-100">
                    שם | סוג התחייבות | תאריך | טלפון | סכום
                  </code>
                </div>
                
                <textarea
                  value={importText}
                  onChange={(e) => setImportText(e.target.value)}
                  placeholder="חנן נתן    מפטיר    א תשרי תשפז    0507701475    700"
                  className="w-full h-64 p-4 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 font-mono text-sm rtl text-left"
                  dir="auto"
                />
                
                {importError && (
                  <div className="text-red-500 text-sm font-medium bg-red-50 p-3 rounded-lg">{importError}</div>
                )}
                
                {importSuccess && (
                  <div className="text-emerald-600 text-sm font-medium bg-emerald-50 p-3 rounded-lg">{importSuccess}</div>
                )}
                
                <button
                  onClick={handleImportSubmit}
                  className="w-full py-3 bg-indigo-600 text-white font-bold rounded-lg shadow hover:bg-indigo-700 transition-colors"
                >
                  בצע ייבוא
                </button>
              </div>
            </div>
          )}
`;
code = code.replace(
  "{activeTab === 'add' ? (",
  importUI + "\n          {activeTab === 'add' ? ("
);

fs.writeFileSync('src/components/AdminDashboard.tsx', code);
