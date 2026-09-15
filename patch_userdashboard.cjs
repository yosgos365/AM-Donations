const fs = require('fs');

let code = fs.readFileSync('src/components/UserDashboard.tsx', 'utf-8');

// Add imports
code = code.replace(
  "import { LogOut, Check, Clock, FileText, CheckCircle2, Download, CreditCard } from 'lucide-react';",
  "import { LogOut, Check, Clock, FileText, CheckCircle2, Download, CreditCard, Printer } from 'lucide-react';\nimport html2canvas from 'html2canvas';"
);

// Add state for receipt
code = code.replace(
  "const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);",
  "const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);\n  const [receiptPledge, setReceiptPledge] = useState<Pledge | null>(null);\n  const [generatedReceipt, setGeneratedReceipt] = useState<string | null>(null);"
);

// Add handleDownloadReceipt function
const downloadFn = `
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
        link.download = \`קבלה-\${receiptPledge?.receiptNumber || 'תרומה'}.png\`;
        link.click();
      }
    } catch (err) {
      console.error('Failed to download receipt', err);
      alert('אירעה שגיאה בהורדת הקבלה.');
    }
  };
`;

code = code.replace(
  "const handlePaymentSubmit",
  downloadFn + "\n  const handlePaymentSubmit"
);

// Update download button onClick
code = code.replace(
  /<button className="flex items-center justify-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 font-medium rounded-lg border border-slate-300 transition-colors w-full sm:w-auto">/g,
  '<button onClick={() => setReceiptPledge(pledge)} className="flex items-center justify-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 font-medium rounded-lg border border-slate-300 transition-colors w-full sm:w-auto">'
);

// Add receipt modal UI at the end
const receiptModal = `
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
`;

code = code.replace(
  "    </div>\n  );\n}",
  receiptModal + "\n    </div>\n  );\n}"
);

fs.writeFileSync('src/components/UserDashboard.tsx', code);
