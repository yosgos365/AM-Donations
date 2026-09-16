const fs = require('fs');

let code = fs.readFileSync('src/components/AdminDashboard.tsx', 'utf-8');

// 1. Add "Add Worshipper" button and its handler.
const addUserLogic = `
  const handleAddNewUser = () => {
    const newName = prompt('הכנס שם מתפלל חדש:');
    if (!newName) return;
    const newPhone = prompt('הכנס מספר טלפון (05X-XXXXXXX):');
    if (!newPhone) return;
    onAddUser(newName, newPhone);
  };
`;

code = code.replace(
  "const handleAddSubmit = (e: React.FormEvent) => {",
  addUserLogic + "\n  const handleAddSubmit = (e: React.FormEvent) => {"
);

const usersTabUI = `
          ) : activeTab === 'users' ? (
            <div className="overflow-x-auto">
              <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                <h3 className="font-bold text-slate-800">רשימת מתפללים</h3>
                <button onClick={handleAddNewUser} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-lg transition-colors flex items-center gap-2">
                  <PlusCircle className="w-4 h-4" />
                  הוסף מתפלל חדש
                </button>
              </div>
              {users.filter(u => u.role !== 'admin' && (searchTerm ? u.name.includes(searchTerm) || u.phone.includes(searchTerm) : true)).length === 0 ? (
`;

code = code.replace(
  "          ) : activeTab === 'users' ? (\n            <div className=\"overflow-x-auto\">\n              {users.filter(u => u.role !== 'admin' && (searchTerm ? u.name.includes(searchTerm) || u.phone.includes(searchTerm) : true)).length === 0 ? (",
  usersTabUI
);

// 2. Add CSV export logic
const exportLogic = `
  const handleExportCSV = () => {
    const headers = ['שם מתפלל', 'טלפון', 'סוג התחייבות/תרומה', 'סכום', 'תאריך', 'סטטוס', 'אמצעי תשלום'];
    
    // Map data
    const rows = filteredPledges.map(p => {
      const u = getUserDetails(p.userId);
      const statusStr = p.status === 'open' ? 'לא שולם' : p.status === 'pending' ? 'ממתין לאישור' : 'שולם';
      const paymentMethodStr = p.paymentMethod === 'cash' ? 'מזומן' : p.paymentMethod === 'bank' ? 'העברה בנקאית' : p.paymentMethod === 'paybox' ? 'פייבוקס / אשראי' : '';
      
      return [
        u?.name || 'לא ידוע',
        u?.phone || '',
        p.type,
        p.amount.toString(),
        new Date(p.date).toLocaleDateString('he-IL'),
        statusStr,
        paymentMethodStr
      ].map(field => \`"\${field}"\`).join(',');
    });
    
    const csvContent = '\\uFEFF' + [headers.map(h => \`"\${h}"\`).join(','), ...rows].join('\\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = \`דוח_הכנסות_\${new Date().toLocaleDateString('he-IL').replace(/\\//g, '-')}.csv\`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
`;

code = code.replace(
  "const handleAddSubmit = (e: React.FormEvent) => {",
  exportLogic + "\n  const handleAddSubmit = (e: React.FormEvent) => {"
);

// We need an export button. Put it next to the search bar.
const searchBarRegex = /\{\(activeTab === 'all' \|\| activeTab === 'pending' \|\| activeTab === 'users'\) && \([\s\S]*?\}\)/;

const searchBarNew = `
        {(activeTab === 'all' || activeTab === 'pending' || activeTab === 'users') && (
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6 flex gap-3 items-center justify-between">
            <div className="flex gap-3 items-center flex-1 max-w-lg">
              <Search className="w-5 h-5 text-slate-400 flex-shrink-0" />
              <input
                type="text"
                placeholder="חיפוש לפי שם, טלפון או סוג..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-slate-700"
              />
            </div>
            
            {activeTab !== 'users' && (
              <button 
                onClick={handleExportCSV}
                className="px-4 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 font-bold rounded-lg transition-colors flex items-center gap-2 text-sm whitespace-nowrap"
              >
                <Download className="w-4 h-4" />
                ייצא לאקסל
              </button>
            )}
          </div>
        )}
`;

code = code.replace(searchBarRegex, searchBarNew);

fs.writeFileSync('src/components/AdminDashboard.tsx', code);
