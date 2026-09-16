const fs = require('fs');

let code = fs.readFileSync('src/components/AdminDashboard.tsx', 'utf-8');

// 1. Add state variable
const stateRegex = /const \[generatedReceipt, setGeneratedReceipt\] = useState<string \| null>\(null\);/;
const stateNew = `const [generatedReceipt, setGeneratedReceipt] = useState<string | null>(null);
  const [userModal, setUserModal] = useState<{ isOpen: boolean; mode: 'add' | 'edit'; id?: string; name: string; phone: string }>({ isOpen: false, mode: 'add', name: '', phone: '' });`;
code = code.replace(stateRegex, stateNew);

// 2. Replace handleAddNewUser
const handleAddNewUserRegex = /const handleAddNewUser = \(\) => \{\n    const newName = prompt\('הכנס שם מתפלל חדש:'\);\n    if \(!newName\) return;\n    const newPhone = prompt\('הכנס מספר טלפון \(05X-XXXXXXX\):'\);\n    if \(!newPhone\) return;\n    onAddUser\(newName, newPhone\);\n  \};/;
const handleAddNewUserNew = `const openAddUserModal = () => {
    setUserModal({ isOpen: true, mode: 'add', name: '', phone: '' });
  };
  
  const openEditUserModal = (id: string, name: string, phone: string) => {
    setUserModal({ isOpen: true, mode: 'edit', id, name, phone });
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userModal.name || !userModal.phone) return;
    
    if (userModal.mode === 'add') {
      onAddUser(userModal.name, userModal.phone);
    } else if (userModal.mode === 'edit' && userModal.id) {
      onUpdateUser(userModal.id, userModal.name, userModal.phone);
    }
    
    setUserModal({ isOpen: false, mode: 'add', name: '', phone: '' });
  };`;
code = code.replace(handleAddNewUserRegex, handleAddNewUserNew);

// 3. Update button onclick for adding
code = code.replace(/<button onClick=\{handleAddNewUser\}/, '<button onClick={openAddUserModal}');

// 4. Update button onclick for editing
const editButtonRegex = /onClick=\{\(\) => \{\n                              const newName = prompt\('ערוך שם מתפלל:', u\.name\);\n                              const newPhone = prompt\('ערוך מספר טלפון:', u\.phone\);\n                              if \(newName && newPhone\) \{\n                                onUpdateUser\(u\.id, newName, newPhone\);\n                              \}\n                            \}\}/;
const editButtonNew = `onClick={() => openEditUserModal(u.id, u.name, u.phone)}`;
code = code.replace(editButtonRegex, editButtonNew);

// 5. Add User Modal UI to the bottom of the component, just before the receipt modal (or after it)
const userModalUI = `
      {/* User Modal */}
      {userModal.isOpen && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md my-8 overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-800">
                {userModal.mode === 'add' ? 'הוספת מתפלל חדש' : 'עריכת מתפלל'}
              </h3>
              <button
                onClick={() => setUserModal({ isOpen: false, mode: 'add', name: '', phone: '' })}
                className="text-slate-400 hover:text-slate-600 transition-colors font-bold"
              >
                &times;
              </button>
            </div>
            
            <form onSubmit={handleSaveUser} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">שם מתפלל</label>
                <input
                  type="text"
                  required
                  value={userModal.name}
                  onChange={(e) => setUserModal({ ...userModal, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  placeholder="ישראל ישראלי"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">מספר טלפון (כניסה למערכת)</label>
                <input
                  type="tel"
                  required
                  value={userModal.phone}
                  onChange={(e) => setUserModal({ ...userModal, phone: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-mono text-right"
                  dir="ltr"
                  placeholder="05X-XXXXXXX"
                />
              </div>
              
              <div className="pt-4 flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setUserModal({ isOpen: false, mode: 'add', name: '', phone: '' })}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 font-medium rounded-lg transition-colors"
                >
                  ביטול
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-lg shadow hover:bg-indigo-700 transition-colors"
                >
                  {userModal.mode === 'add' ? 'שמור מתפלל' : 'עדכן פרטים'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
`;

const receiptModalRegex = /\{\/\* Receipt Modal \*\/\}/;
code = code.replace(receiptModalRegex, userModalUI + "\n      {/* Receipt Modal */}");

fs.writeFileSync('src/components/AdminDashboard.tsx', code);
