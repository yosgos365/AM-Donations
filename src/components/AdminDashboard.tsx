import React, { useState } from 'react';
import { User, Pledge } from '../types';
import { LogOut, Users, FileCheck, PlusCircle, CheckCircle2, Search, Image as ImageIcon, Contact, Printer, Download } from 'lucide-react';
import html2canvas from 'html2canvas';

interface AdminDashboardProps {
  user: User;
  users: User[];
  pledges: Pledge[];
  onLogout: () => void;
  onApprovePledge: (id: string) => void;
  onAddPledge: (pledgeData: Partial<Pledge>, userName: string, phone: string) => void;
  onUpdateUser: (id: string, name: string, phone: string) => void;
  onAddUser: (name: string, phone: string) => void;
}

export function AdminDashboard({ user, users, pledges, onLogout, onApprovePledge, onAddPledge, onUpdateUser, onAddUser }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'pending' | 'add' | 'all' | 'users'>('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [receiptPledge, setReceiptPledge] = useState<Pledge | null>(null);
  const [generatedReceipt, setGeneratedReceipt] = useState<string | null>(null);

  
  const handleDownloadReceipt = async () => {
    const receiptElement = document.getElementById('receipt-content-to-download');
    if (!receiptElement) return;
    
    try {
      // Hide the buttons temporarily for clean render just in case
      const canvas = await html2canvas(receiptElement, {
        scale: 2,
        backgroundColor: '#ffffff'
      });
      
      const image = canvas.toDataURL('image/png');
      
      // Check if in iframe (AI Studio preview)
      if (window.self !== window.top) {
        // We are in an iframe, download might be blocked. Show the image directly.
        setGeneratedReceipt(image);
      } else {
        // Normal download
        const link = document.createElement('a');
        link.href = image;
        link.download = `קבלה-${receiptPledge?.receiptNumber || 'תרומה'}.png`;
        link.click();
      }
    } catch (err) {
      console.error('Failed to download receipt', err);
      alert('אירעה שגיאה בהורדת הקבלה.');
    }
  };

  const pendingPledges = pledges.filter(p => p.status === 'pending');
  
  // New pledge form state
  const [newPledgeName, setNewPledgeName] = useState('');
  const [newPledgePhone, setNewPledgePhone] = useState('');
  const [newPledgeType, setNewPledgeType] = useState('עלייה לתורה');
  const [newPledgeAmount, setNewPledgeAmount] = useState('');
  const [newPledgeDate, setNewPledgeDate] = useState(new Date().toISOString().split('T')[0]);

  // Derived state to check if the entered name matches an existing user
  const matchingUser = users.find(u => u.name === newPledgeName);
  const isExistingUser = !!matchingUser;

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const phoneToUse = isExistingUser ? matchingUser.phone : newPledgePhone;
    if (!newPledgeName || (!isExistingUser && !newPledgePhone) || !newPledgeAmount) {
      alert('נא למלא את כל שדות החובה.');
      return;
    }

    onAddPledge({
      type: newPledgeType,
      amount: Number(newPledgeAmount),
      date: newPledgeDate,
      status: 'open'
    }, newPledgeName, phoneToUse);

    setNewPledgeName('');
    setNewPledgePhone('');
    setNewPledgeAmount('');
    setActiveTab('all');
    alert('ההתחייבות נוספה בהצלחה! השם שויך לרשימת ההתחייבויות.');
  };

  const getUserDetails = (userId: string) => users.find(u => u.id === userId);

  const filteredPledges = pledges.filter(p => {
    if (activeTab === 'pending' && p.status !== 'pending') return false;
    
    if (searchTerm) {
      const u = getUserDetails(p.userId);
      return u?.name.includes(searchTerm) || u?.phone.includes(searchTerm) || p.type.includes(searchTerm);
    }
    return true;
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="min-h-screen bg-stone-100 pb-12">
      {/* Header */}
      <header className="bg-slate-900 text-white shadow-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-slate-800 p-2 rounded-lg">
              <Users className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-wide">ממשק ניהול גבאים</h1>
              <p className="text-slate-300 text-sm">שלום, {user.name}</p>
            </div>
          </div>
          <button onClick={onLogout} className="text-slate-300 hover:text-white flex items-center gap-1 p-2 rounded-lg hover:bg-slate-800 transition-colors">
            <LogOut className="w-5 h-5" />
            <span className="hidden sm:inline text-sm font-medium">התנתק</span>
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 mt-8">
        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-2 scrollbar-hide">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-4 py-2 text-sm font-medium transition-colors flex items-center gap-2 rounded-md whitespace-nowrap ${
              activeTab === 'pending' ? 'bg-stone-100 text-stone-900' : 'text-stone-500 hover:text-stone-700'
            }`}
          >
            <FileCheck className="w-4 h-4" />
            ממתינים לאישור
            {pendingPledges.length > 0 && (
              <span className="bg-indigo-100 text-indigo-700 py-0.5 px-2 rounded-full text-xs">
                {pendingPledges.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 text-sm font-medium transition-colors flex items-center gap-2 rounded-md whitespace-nowrap ${
              activeTab === 'all' ? 'bg-stone-100 text-stone-900' : 'text-stone-500 hover:text-stone-700'
            }`}
          >
            <Users className="w-4 h-4" />
            כל ההתחייבויות
          </button>
          <button
            onClick={() => setActiveTab('add')}
            className={`px-4 py-2 text-sm font-medium transition-colors flex items-center gap-2 rounded-md whitespace-nowrap ${
              activeTab === 'add' ? 'bg-stone-100 text-stone-900' : 'text-stone-500 hover:text-stone-700'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            הוספת התחייבות
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 text-sm font-medium transition-colors flex items-center gap-2 rounded-md whitespace-nowrap ${
              activeTab === 'users' ? 'bg-stone-100 text-stone-900' : 'text-stone-500 hover:text-stone-700'
            }`}
          >
            <Contact className="w-4 h-4" />
            מתפללים
          </button>
        </div>

        {/* Search Bar */}
        {(activeTab === 'all' || activeTab === 'pending' || activeTab === 'users') && (
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6 flex gap-3 items-center">
            <Search className="w-5 h-5 text-slate-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="חיפוש לפי שם, טלפון או סוג..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-slate-700"
            />
          </div>
        )}

        {/* Content Area */}
        <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
          
          {activeTab === 'add' ? (
            <div className="p-8 max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-slate-800 mb-6 border-b border-slate-100 pb-4">רישום התחייבות / אורח חדש</h2>
              <form onSubmit={handleAddSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">שם מתפלל / אורח</label>
                    <input 
                      required 
                      type="text" 
                      list="users-list"
                      value={newPledgeName} 
                      onChange={e=>setNewPledgeName(e.target.value)} 
                      className="w-full p-2.5 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600" 
                      placeholder="ישראל ישראלי" 
                    />
                    <datalist id="users-list">
                      {users.filter(u => u.role !== 'admin').map(u => (
                        <option key={u.id} value={u.name} />
                      ))}
                    </datalist>
                  </div>
                  {!isExistingUser && (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">מספר טלפון (לזיהוי וכניסה למשתמש חדש)</label>
                      <input 
                        required 
                        type="tel" 
                        value={newPledgePhone} 
                        onChange={e=>setNewPledgePhone(e.target.value)} 
                        className="w-full p-2.5 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600" 
                        placeholder="05X-XXXXXXX" 
                        dir="ltr" 
                      />
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">סוג התחייבות</label>
                    <input required type="text" value={newPledgeType} onChange={e=>setNewPledgeType(e.target.value)} className="w-full p-2.5 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600" placeholder="לדוגמה: מפטיר, נדר..." />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">סכום (₪)</label>
                    <input required type="number" min="0" value={newPledgeAmount} onChange={e=>setNewPledgeAmount(e.target.value)} className="w-full p-2.5 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600" placeholder="0" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">תאריך החיוב</label>
                  <input required type="date" value={newPledgeDate} onChange={e=>setNewPledgeDate(e.target.value)} className="w-full p-2.5 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600" />
                </div>

                <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg mt-6 transition-colors shadow-sm text-lg">
                  שמור וצור התחייבות
                </button>
              </form>
            </div>
          ) : activeTab === 'users' ? (
            <div className="overflow-x-auto">
              {users.filter(u => u.role !== 'admin' && (searchTerm ? u.name.includes(searchTerm) || u.phone.includes(searchTerm) : true)).length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  לא נמצאו מתפללים.
                </div>
              ) : (
                <table className="w-full text-right">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 text-sm font-medium">
                    <tr>
                      <th className="p-4">שם מתפלל</th>
                      <th className="p-4">מספר טלפון</th>
                      <th className="p-4">פעולות</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {users.filter(u => u.role !== 'admin' && (searchTerm ? u.name.includes(searchTerm) || u.phone.includes(searchTerm) : true)).map(u => (
                      <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-4 font-bold text-slate-800">{u.name}</td>
                        <td className="p-4 font-mono text-slate-600" dir="ltr">{u.phone}</td>
                        <td className="p-4">
                          <button
                            onClick={() => {
                              const newName = prompt('ערוך שם מתפלל:', u.name);
                              const newPhone = prompt('ערוך מספר טלפון:', u.phone);
                              if (newName && newPhone) {
                                onUpdateUser(u.id, newName, newPhone);
                              }
                            }}
                            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium transition-colors"
                          >
                            ערוך פרטים
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              {filteredPledges.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  לא נמצאו תוצאות.
                </div>
              ) : (
                <table className="w-full text-right">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 text-sm font-medium">
                    <tr>
                      <th className="p-4">מתפלל</th>
                      <th className="p-4">סוג</th>
                      <th className="p-4">סכום</th>
                      <th className="p-4">תאריך</th>
                      <th className="p-4">סטטוס</th>
                      <th className="p-4">פעולות</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredPledges.map(pledge => {
                      const pledgeUser = getUserDetails(pledge.userId);
                      return (
                        <tr key={pledge.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="p-4">
                            <div className="font-bold text-slate-800">{pledgeUser?.name || 'לא ידוע'}</div>
                            <div className="text-sm text-slate-500">{pledgeUser?.phone}</div>
                          </td>
                          <td className="p-4 font-medium text-slate-800">{pledge.type}</td>
                          <td className="p-4 font-bold text-slate-900">₪{pledge.amount}</td>
                          <td className="p-4 text-sm text-slate-600">{new Date(pledge.date).toLocaleDateString('he-IL')}</td>
                          <td className="p-4">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                              pledge.status === 'open' ? 'bg-slate-100 text-slate-700' :
                              pledge.status === 'pending' ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                              'bg-emerald-100 text-emerald-700'
                            }`}>
                              {pledge.status === 'open' ? 'לא שולם' :
                               pledge.status === 'pending' ? 'ממתין לאישור' : 'שולם'}
                            </span>
                          </td>
                          <td className="p-4">
                            {pledge.status === 'pending' && (
                              <div className="flex gap-2">
                                <button
                                  className="flex items-center gap-1 bg-white hover:bg-slate-50 text-slate-700 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border border-slate-200"
                                  onClick={() => alert('מציג אסמכתא (בדמו לא נשמר קובץ אמיתי, אבל כאן תיפתח התמונה)')}
                                >
                                  <ImageIcon className="w-4 h-4" />
                                  צפה באסמכתא
                                </button>
                                <button
                                  onClick={() => onApprovePledge(pledge.id)}
                                  className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-sm font-bold transition-colors shadow-sm"
                                >
                                  <CheckCircle2 className="w-4 h-4" />
                                  אשר
                                </button>
                              </div>
                            )}
                            {pledge.status === 'paid' && (
                              <button
                                onClick={() => setReceiptPledge(pledge)}
                                className="flex items-center gap-1 bg-blue-50 text-blue-700 hover:bg-blue-100 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border border-blue-200"
                              >
                                <Printer className="w-4 h-4" />
                                הופקה קבלה {pledge.receiptNumber}
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Receipt Modal */}
      {receiptPledge && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md my-8">
            <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50 rounded-t-xl print:hidden">
              <h3 className="font-bold text-slate-800">הדפסת קבלה</h3>
              <div className="flex gap-2">
                
                <button
                  onClick={handleDownloadReceipt}
                  className="px-3 py-1.5 bg-emerald-600 text-white text-sm font-bold rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-1"
                >
                  <Download className="w-4 h-4" />
                  הורד
                </button>

                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-1"
                >
                  <Printer className="w-4 h-4" />
                  הדפס
                </button>
                <button
                  onClick={() => { setReceiptPledge(null); setGeneratedReceipt(null); }}
                  className="px-3 py-1.5 text-slate-500 hover:bg-slate-200 text-sm font-bold rounded-lg transition-colors"
                >
                  סגור
                </button>
              </div>
            </div>
            
            
            {generatedReceipt ? (
              <div className="p-8 bg-white text-center rounded-b-xl">
                <p className="text-emerald-600 font-bold mb-4">הקבלה הופקה בהצלחה!</p>
                <p className="text-slate-600 text-sm mb-4">בגלל שאתה במצב תצוגה מקדימה, שמירת הקבלה מתבצעת כך:</p>
                <img src={generatedReceipt} alt="קבלה" className="max-w-full h-auto border border-slate-200 shadow-sm mx-auto mb-4 rounded" />
                <p className="text-indigo-600 font-bold text-sm bg-indigo-50 p-3 rounded-lg inline-block">
                  👈 מטלפון: לחיצה ארוכה על התמונה ➔ "שמור תמונה"<br/>
                  🖱️ ממחשב: קליק ימני על התמונה ➔ "שמור תמונה בשם..."
                </p>
              </div>
            ) : (
              <div id="receipt-content-to-download" className="p-8 print:p-0 receipt-content bg-white text-slate-900">

              <div className="text-center mb-6 border-b border-slate-200 pb-6">
                <h2 className="text-2xl font-bold text-slate-900 mb-1">אחוות מנחם</h2>
                <p className="text-slate-500 text-sm">קבלה על תרומה / התחייבות</p>
                <div className="mt-4 inline-block bg-slate-100 px-3 py-1 rounded-md text-sm font-mono text-slate-700 font-bold border border-slate-200">
                  מספר קבלה: {receiptPledge.receiptNumber}
                </div>
              </div>
              
              <div className="space-y-4 mb-8 text-sm">
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-500">תאריך הפקה:</span>
                  <span className="font-bold">{new Date().toLocaleDateString('he-IL')}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-500">שם התורם:</span>
                  <span className="font-bold text-lg">{getUserDetails(receiptPledge.userId)?.name || 'לא ידוע'}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-500">תיאור/סוג:</span>
                  <span className="font-bold">{receiptPledge.type}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-500">סכום ששולם:</span>
                  <span className="font-bold text-xl">₪{receiptPledge.amount}</span>
                </div>
              </div>

              <div className="text-center text-sm text-slate-500 pt-6 border-t border-slate-200 border-dashed">
                <p className="font-bold mb-1">תודה רבה על תרומתך!</p>
                <p>הקבלה מהווה אישור על התשלום שבוצע.</p>
              </div>
            </div>
            )}
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body * { visibility: hidden; }
          .receipt-content, .receipt-content * { visibility: visible; }
          .receipt-content { position: absolute; left: 0; top: 0; width: 100%; padding: 40px !important; }
        }
      `}} />
    </div>
  );
}
