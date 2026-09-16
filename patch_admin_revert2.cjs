const fs = require('fs');
let code = fs.readFileSync('src/components/AdminDashboard.tsx', 'utf-8');

const leftover = `{activeTab === 'import' && (
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
          )}`;

code = code.replace(leftover, '');
fs.writeFileSync('src/components/AdminDashboard.tsx', code);
