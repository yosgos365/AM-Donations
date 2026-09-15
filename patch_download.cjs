const fs = require('fs');

let code = fs.readFileSync('src/components/AdminDashboard.tsx', 'utf-8');

// Add state for generated image
code = code.replace(
  "const [receiptPledge, setReceiptPledge] = useState<Pledge | null>(null);",
  "const [receiptPledge, setReceiptPledge] = useState<Pledge | null>(null);\n  const [generatedReceipt, setGeneratedReceipt] = useState<string | null>(null);"
);

// Update download function
const newDownloadFn = `
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
  /const handleDownloadReceipt = async \(\) => \{[\s\S]*?alert\('אירעה שגיאה בהורדת הקבלה\.'\);\s*\}\s*\};/,
  newDownloadFn.trim()
);

// Reset generated receipt when closing modal
code = code.replace(
  "onClick={() => setReceiptPledge(null)}",
  "onClick={() => { setReceiptPledge(null); setGeneratedReceipt(null); }}"
);

// Show image if generated
const generatedImageUI = `
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
`;

code = code.replace(
  /<div id="receipt-content-to-download" className="p-8 print:p-0 receipt-content bg-white text-slate-900">/,
  generatedImageUI
);

code = code.replace(
  /<p>הקבלה מהווה אישור על התשלום שבוצע\.<\/p>\s*<\/div>\s*<\/div>/,
  "<p>הקבלה מהווה אישור על התשלום שבוצע.</p>\n              </div>\n            </div>\n            )}"
);


fs.writeFileSync('src/components/AdminDashboard.tsx', code);
