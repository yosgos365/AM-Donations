const fs = require('fs');

let code = fs.readFileSync('src/components/UserDashboard.tsx', 'utf-8');

// 1. Change new entities defaults
code = code.replace(
  "const [newFamilyMember, setNewFamilyMember] = useState({ name: '', hebrewDob: { year: 5784, month: 7, day: 1 } });",
  "const [newFamilyMember, setNewFamilyMember] = useState<{name: string, hebrewDob: any}>({ name: '', hebrewDob: null });"
);

code = code.replace(
  "setNewFamilyMember({ name: '', hebrewDob: { year: 5784, month: 7, day: 1 } });",
  "setNewFamilyMember({ name: '', hebrewDob: null });"
);

code = code.replace(
  "const [newYahrzeit, setNewYahrzeit] = useState({ name: '', hebrewDate: { year: 5784, month: 7, day: 1 } });",
  "const [newYahrzeit, setNewYahrzeit] = useState<{name: string, hebrewDate: any}>({ name: '', hebrewDate: null });"
);

code = code.replace(
  "setNewYahrzeit({ name: '', hebrewDate: { year: 5784, month: 7, day: 1 } });",
  "setNewYahrzeit({ name: '', hebrewDate: null });"
);

// 2. Change styling for settings tab. Let's merge the "bg-white p-6 rounded-xl border border-slate-200 shadow-sm" bubbles into one.
// We'll replace the first one to just be a section, and wrap them all in one white card.
code = code.replace(
  "{activeTab === 'settings' && (\n          <div className=\"space-y-6\">\n            <div className=\"bg-white p-6 rounded-xl border border-slate-200 shadow-sm\">",
  "{activeTab === 'settings' && (\n          <div className=\"bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-8\">\n            <div>"
);

code = code.replace(
  "</div>\n            </div>\n\n            <div className=\"bg-white p-6 rounded-xl border border-slate-200 shadow-sm\">",
  "</div>\n            </div>\n\n            <div className=\"border-t border-slate-100 pt-6\">"
);

code = code.replace(
  "              </div>\n            </div>\n            <div className=\"bg-white p-6 rounded-xl border border-slate-200 shadow-sm\">",
  "              </div>\n            </div>\n            <div className=\"border-t border-slate-100 pt-6\">"
);

code = code.replace(
  "</div>\n            </div>\n          </div>\n        )}",
  "</div>\n            </div>\n          </div>\n        )}"
);

// 3. Add alert for missing info at the top of the dashboard main content.
const alertHtml = `
        {(!user.hebrewDob || !user.name) && (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-lg mb-6 flex items-center justify-between">
            <div>
              <p className="font-bold">חסרים פרטים באזור האישי</p>
              <p className="text-sm text-amber-700">אנא עדכן את תאריך הלידה שלך ופרטים נוספים בהגדרות החשבון.</p>
            </div>
            <button 
              onClick={() => setActiveTab('settings')}
              className="px-4 py-2 bg-amber-100 hover:bg-amber-200 text-amber-800 font-medium rounded-lg text-sm transition-colors"
            >
              לעדכון
            </button>
          </div>
        )}
`;

code = code.replace(
  "        {/* Tabs */}",
  alertHtml + "\n        {/* Tabs */}"
);


fs.writeFileSync('src/components/UserDashboard.tsx', code);
