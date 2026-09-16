const fs = require('fs');

let adminCode = fs.readFileSync('src/components/AdminDashboard.tsx', 'utf-8');

// 1. Revert the table cell
const actionsTdRegex = /<td className="p-4">\n                          <div className="flex items-center gap-3">\n                            <button\n                              onClick=\{\(\) => openEditUserModal\(u\.id, u\.name, u\.phone\)\}\n                              className="text-indigo-600 hover:text-indigo-800 text-sm font-medium transition-colors"\n                            >\n                              ערוך פרטים\n                            <\/button>\n                            <span className="text-slate-300">\|<\/span>\n                            <button\n                              onClick=\{\(\) => setDeleteConfirmModal\(\{ isOpen: true, id: u\.id, name: u\.name \}\)\}\n                              className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors"\n                            >\n                              מחק\n                            <\/button>\n                          <\/div>\n                        <\/td>/;

const actionsTdNew = `<td className="p-4">
                          <button
                            onClick={() => openEditUserModal(u.id, u.name, u.phone)}
                            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium transition-colors"
                          >
                            ערוך פרטים
                          </button>
                        </td>`;

adminCode = adminCode.replace(actionsTdRegex, actionsTdNew);

// 2. Modify the modal footer
const modalFooterRegex = /<div className="pt-4 flex gap-3 justify-end">\n                <button\n                  type="button"\n                  onClick=\{\(\) => setUserModal\(\{ isOpen: false, mode: 'add', name: '', phone: '' \}\)\}\n                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 font-medium rounded-lg transition-colors"\n                >\n                  ביטול\n                <\/button>\n                <button\n                  type="submit"\n                  className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-lg shadow hover:bg-indigo-700 transition-colors"\n                >\n                  \{userModal\.mode === 'add' \? 'שמור מתפלל' : 'עדכן פרטים'\}\n                <\/button>\n              <\/div>/;

const modalFooterNew = `<div className="pt-4 flex items-center justify-between mt-2">
                <div>
                  {userModal.mode === 'edit' && (
                    <button
                      type="button"
                      onClick={() => {
                        setUserModal({ isOpen: false, mode: 'add', name: '', phone: '' });
                        setDeleteConfirmModal({ isOpen: true, id: userModal.id || '', name: userModal.name });
                      }}
                      className="px-4 py-2 text-red-600 hover:bg-red-50 font-medium rounded-lg transition-colors flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      מחק מתפלל
                    </button>
                  )}
                </div>
                <div className="flex gap-3">
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
              </div>`;

adminCode = adminCode.replace(modalFooterRegex, modalFooterNew);

fs.writeFileSync('src/components/AdminDashboard.tsx', adminCode);
