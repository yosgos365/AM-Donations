const fs = require('fs');

let appCode = fs.readFileSync('src/App.tsx', 'utf-8');
const handleUpdateUserRegex = /const handleUpdateUser = \(id: string, name: string, phone: string\) => \{\n    setUsers\(prev => prev.map\(u => u.id === id \? \{ ...u, name, phone \} : u\)\);\n  \};/;
const updatedAppMethods = `const handleUpdateUser = (id: string, name: string, phone: string) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, name, phone } : u));
  };
  
  const handleDeleteUser = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
  };`;
appCode = appCode.replace(handleUpdateUserRegex, updatedAppMethods);

const onAddUserRegex = /onAddUser=\{handleAddUser\}\n      \/>/;
const onAddUserNew = `onAddUser={handleAddUser}
        onDeleteUser={handleDeleteUser}
      />`;
appCode = appCode.replace(onAddUserRegex, onAddUserNew);
fs.writeFileSync('src/App.tsx', appCode);

let adminCode = fs.readFileSync('src/components/AdminDashboard.tsx', 'utf-8');
adminCode = adminCode.replace(/import \{ LogOut, Users, FileCheck, PlusCircle, CheckCircle2, Search, Image as ImageIcon, Contact, Printer, Download \} from 'lucide-react';/,
"import { LogOut, Users, FileCheck, PlusCircle, CheckCircle2, Search, Image as ImageIcon, Contact, Printer, Download, Trash2 } from 'lucide-react';");

adminCode = adminCode.replace(/onAddUser: \(name: string, phone: string\) => void;\n\}/,
`onAddUser: (name: string, phone: string) => void;
  onDeleteUser: (id: string) => void;
}`);

adminCode = adminCode.replace(/onUpdateUser, onAddUser \}: AdminDashboardProps\)/,
`onUpdateUser, onAddUser, onDeleteUser }: AdminDashboardProps)`);

adminCode = adminCode.replace(/const \[userModal, setUserModal\] = useState<\{ isOpen: boolean; mode: 'add' \| 'edit'; id\?: string; name: string; phone: string \}>\(\{ isOpen: false, mode: 'add', name: '', phone: '' \}\);/,
`const [userModal, setUserModal] = useState<{ isOpen: boolean; mode: 'add' | 'edit'; id?: string; name: string; phone: string }>({ isOpen: false, mode: 'add', name: '', phone: '' });
  const [deleteConfirmModal, setDeleteConfirmModal] = useState<{ isOpen: boolean; id: string; name: string }>({ isOpen: false, id: '', name: '' });`);

const deleteUserModalUI = `
      {/* Delete Confirm Modal */}
      {deleteConfirmModal.isOpen && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-[60] overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm my-8 overflow-hidden text-center">
            <div className="p-6">
              <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">מחיקת מתפלל</h3>
              <p className="text-slate-600 text-sm mb-6">
                האם אתה בטוח שברצונך למחוק את <strong>{deleteConfirmModal.name}</strong>? פעולה זו תסיר את המשתמש מהמערכת.
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setDeleteConfirmModal({ isOpen: false, id: '', name: '' })}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 font-medium rounded-lg transition-colors w-full"
                >
                  ביטול
                </button>
                <button
                  onClick={() => {
                    onDeleteUser(deleteConfirmModal.id);
                    setDeleteConfirmModal({ isOpen: false, id: '', name: '' });
                  }}
                  className="px-4 py-2 bg-red-600 text-white font-bold rounded-lg shadow hover:bg-red-700 transition-colors w-full"
                >
                  מחק
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
`;

adminCode = adminCode.replace(/\{\/\* User Modal \*\/\}/, deleteUserModalUI + "\n      {/* User Modal */}");

const actionsTdRegex = /<td className="p-4">\n                          <button\n                            onClick=\{\(\) => openEditUserModal\(u\.id, u\.name, u\.phone\)\}\n                            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium transition-colors"\n                          >\n                            ערוך פרטים\n                          <\/button>\n                        <\/td>/;

const actionsTdNew = `<td className="p-4">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => openEditUserModal(u.id, u.name, u.phone)}
                              className="text-indigo-600 hover:text-indigo-800 text-sm font-medium transition-colors"
                            >
                              ערוך פרטים
                            </button>
                            <span className="text-slate-300">|</span>
                            <button
                              onClick={() => setDeleteConfirmModal({ isOpen: true, id: u.id, name: u.name })}
                              className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors"
                            >
                              מחק
                            </button>
                          </div>
                        </td>`;

adminCode = adminCode.replace(actionsTdRegex, actionsTdNew);
fs.writeFileSync('src/components/AdminDashboard.tsx', adminCode);
