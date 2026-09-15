import React, { useState } from 'react';
import { User, Pledge } from '../types';
import { LogOut, FileText, Check, Clock, ChevronLeft, CreditCard, Download, CheckCircle2 } from 'lucide-react';
import { PaymentModal } from './PaymentModal';

interface UserDashboardProps {
  user: User;
  pledges: Pledge[];
  onLogout: () => void;
  onSubmitPayment: (pledgeIds: string[], method: 'paybox' | 'bank', file: File | null) => void;
}

export function UserDashboard({ user, pledges, onLogout, onSubmitPayment }: UserDashboardProps) {
  const [activeTab, setActiveTab] = useState<'open' | 'history'>('open');
  const [selectedPledges, setSelectedPledges] = useState<Set<string>>(new Set());
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [receiptPledge, setReceiptPledge] = useState<Pledge | null>(null);
  const [generatedReceipt, setGeneratedReceipt] = useState<string | null>(null);

  const openPledges = pledges.filter(p => p.status === 'open');
  const pendingPledges = pledges.filter(p => p.status === 'pending');
  const paidPledges = pledges.filter(p => p.status === 'paid');

  const historyPledges = [...pendingPledges, ...paidPledges].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const totalOpen = openPledges.reduce((sum, p) => sum + p.amount, 0);
  const selectedAmount = openPledges
    .filter(p => selectedPledges.has(p.id))
    .reduce((sum, p) => sum + p.amount, 0);

  const toggleSelection = (id: string) => {
    const newSet = new Set(selectedPledges);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedPledges(newSet);
  };

  const handleSelectAll = () => {
    if (selectedPledges.size === openPledges.length) {
      setSelectedPledges(new Set());
    } else {
      setSelectedPledges(new Set(openPledges.map(p => p.id)));
    }
  };

  
  const handleDownloadReceipt = async () => {
    const receiptElement = document.getElementById('user-receipt-content-to-download');
    if (!receiptElement) return;
    
    try {
      const canvas = await html2canvas(receiptElement, {
        scale: 2,
        backgroundColor: '#ffffff'
      });
      
      const image = canvas.toDataURL('image/png');
      
      if (window.self !== window.top) {
        setGeneratedReceipt(image);
      } else {
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

  const handlePaymentSubmit = (method: 'paybox' | 'bank', file: File | null) => {
    onSubmitPayment(Array.from(selectedPledges), method, file);
    setIsPaymentModalOpen(false);
    setSelectedPledges(new Set());
    setActiveTab('history');
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 pb-24">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-stone-200 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-lg sm:text-xl font-semibold tracking-tight text-blue-900 whitespace-nowrap">אחוות מנחם</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-left hidden sm:block">
              <h1 className="text-sm font-bold text-stone-800">שלום, {user.name}</h1>
              <p className="text-xs text-stone-500">האזור האישי שלך</p>
            </div>
            <button onClick={onLogout} className="text-stone-500 hover:text-stone-800 flex items-center gap-1 p-2 rounded-lg hover:bg-stone-100 transition-colors">
              <LogOut className="w-5 h-5" />
              <span className="hidden sm:inline text-sm font-medium">התנתק</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="dashboard-tabs bg-white rounded-lg p-1 shadow-sm border border-stone-200 flex max-w-full overflow-x-auto gap-1 mb-6">
          <button
            onClick={() => setActiveTab('open')}
            className={`flex-1 px-4 py-2 text-sm font-medium transition-colors flex items-center justify-center gap-2 rounded-md whitespace-nowrap ${
              activeTab === 'open' ? 'bg-stone-100 text-stone-900' : 'text-stone-500 hover:text-stone-700'
            }`}
          >
            פתוח לתשלום ({openPledges.length})
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 px-4 py-2 text-sm font-medium transition-colors flex items-center justify-center gap-2 rounded-md whitespace-nowrap ${
              activeTab === 'history' ? 'bg-stone-100 text-stone-900' : 'text-stone-500 hover:text-stone-700'
            }`}
          >
            היסטוריה ואישורים
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'open' ? (
          <div className="space-y-4">
            {openPledges.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-slate-200">
                <Check className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-800">אין לך התחייבויות פתוחות</h3>
                <p className="text-slate-500 mt-2">כל הכבוד, הכל משולם!</p>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center px-2">
                  <h2 className="font-bold text-slate-800">פירוט התחייבויות</h2>
                  <button 
                    onClick={handleSelectAll}
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
                  >
                    {selectedPledges.size === openPledges.length ? 'בטל בחירה' : 'בחר הכל'}
                  </button>
                </div>
                
                <div className="space-y-3">
                  {openPledges.map(pledge => (
                    <div
                      key={pledge.id}
                      onClick={() => toggleSelection(pledge.id)}
                      className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        selectedPledges.has(pledge.id) 
                          ? 'border-indigo-500 bg-indigo-50 shadow-sm' 
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="ml-4 flex-shrink-0">
                        <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center ${
                          selectedPledges.has(pledge.id)
                            ? 'bg-indigo-600 border-indigo-600'
                            : 'border-slate-300 bg-white'
                        }`}>
                          {selectedPledges.has(pledge.id) && <Check className="w-4 h-4 text-white" />}
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <h4 className="font-bold text-slate-800">{pledge.type}</h4>
                        <p className="text-sm text-slate-500">{new Date(pledge.date).toLocaleDateString('he-IL')}</p>
                      </div>
                      
                      <div className="text-left font-bold text-lg text-slate-900">
                        ₪{pledge.amount}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {historyPledges.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-slate-200">
                <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-800">אין היסטוריית תשלומים</h3>
              </div>
            ) : (
              historyPledges.map(pledge => (
                <div key={pledge.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-full mt-1 sm:mt-0 ${
                      pledge.status === 'paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                    }`}>
                      {pledge.status === 'paid' ? <CheckCircle2 className="w-6 h-6" /> : <Clock className="w-6 h-6" />}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-lg">{pledge.type}</h4>
                      <p className="text-sm text-slate-500">תאריך: {new Date(pledge.date).toLocaleDateString('he-IL')}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          pledge.status === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {pledge.status === 'paid' ? 'שולם ואושר' : 'ממתין לאישור גבאי'}
                        </span>
                        <span className="text-sm font-bold text-slate-900 mx-2">₪{pledge.amount}</span>
                      </div>
                    </div>
                  </div>
                  
                  {pledge.status === 'paid' && pledge.receiptNumber && (
                    <button onClick={() => setReceiptPledge(pledge)} className="flex items-center justify-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 font-medium rounded-lg border border-slate-300 transition-colors w-full sm:w-auto">
                      <Download className="w-4 h-4" />
                      הורד קבלה ({pledge.receiptNumber})
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </main>

      {/* Floating Action Bar */}
      {activeTab === 'open' && openPledges.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-10">
          <div className="max-w-3xl mx-auto flex items-center justify-between">
            <div>
              <p className="text-sm text-stone-500 font-medium mb-1">סה"כ לתשלום נבחר:</p>
              <p className="text-2xl font-bold text-stone-900">₪{selectedAmount}</p>
            </div>
            <button
              disabled={selectedPledges.size === 0}
              onClick={() => setIsPaymentModalOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-stone-300 disabled:cursor-not-allowed text-white font-medium py-3 px-8 rounded-lg transition-colors flex items-center gap-2 shadow-sm"
            >
              <CreditCard className="w-5 h-5" />
              המשך לתשלום
            </button>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {isPaymentModalOpen && (
        <PaymentModal
          pledges={openPledges.filter(p => selectedPledges.has(p.id))}
          onClose={() => setIsPaymentModalOpen(false)}
          onSubmit={handlePaymentSubmit}
        />
      )}

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
              <div id="user-receipt-content-to-download" className="p-8 print:p-0 receipt-content bg-white text-slate-900">
                <div className="text-center mb-8 border-b-2 border-slate-100 pb-6">
                  <h2 className="text-2xl font-bold text-indigo-700 mb-1">אחוות מנחם</h2>
                  <p className="text-slate-500 font-medium">קבלה / אישור תרומה</p>
                  <div className="mt-4 inline-block bg-slate-50 px-4 py-1.5 rounded-full border border-slate-200 text-sm font-mono text-slate-600">
                    מספר קבלה: {receiptPledge.receiptNumber}
                  </div>
                </div>
                
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-center py-2 border-b border-slate-100">
                    <span className="text-slate-500">לכבוד:</span>
                    <span className="font-bold">{user.name}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-100">
                    <span className="text-slate-500">עבור:</span>
                    <span className="font-bold">{receiptPledge.type}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-100">
                    <span className="text-slate-500">סכום:</span>
                    <span className="font-bold text-lg">₪{receiptPledge.amount}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-100">
                    <span className="text-slate-500">אמצעי תשלום:</span>
                    <span className="font-medium">
                      {receiptPledge.paymentMethod === 'paybox' ? 'פייבוקס/ביט' : 
                       receiptPledge.paymentMethod === 'bank' ? 'העברה בנקאית' : 'מזומן'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-100">
                    <span className="text-slate-500">תאריך תשלום:</span>
                    <span className="font-medium">{new Date(receiptPledge.paidAt || receiptPledge.date).toLocaleDateString('he-IL')}</span>
                  </div>
                </div>
                
                <div className="text-center text-sm text-slate-500 pt-4 border-t-2 border-slate-100">
                  <p className="font-medium text-slate-700 mb-1">תודה רבה על תרומתך!</p>
                  <p>הקבלה מהווה אישור על התשלום שבוצע.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
