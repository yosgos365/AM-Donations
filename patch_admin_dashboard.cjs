const fs = require('fs');
let code = fs.readFileSync('src/components/AdminDashboard.tsx', 'utf-8');

// 1. Import Download and html2canvas
code = code.replace(
  "Contact, Printer } from 'lucide-react';",
  "Contact, Printer, Download } from 'lucide-react';\nimport html2canvas from 'html2canvas';"
);

// 2. Add handleDownloadReceipt function
const downloadFn = `
  const handleDownloadReceipt = async () => {
    const receiptElement = document.getElementById('receipt-content-to-download');
    if (!receiptElement) return;
    
    try {
      const canvas = await html2canvas(receiptElement, {
        scale: 2, // Better resolution
        backgroundColor: '#ffffff'
      });
      
      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = \`קבלה-\${receiptPledge?.receiptNumber || 'תרומה'}.png\`;
      link.click();
    } catch (err) {
      console.error('Failed to download receipt', err);
      alert('אירעה שגיאה בהורדת הקבלה.');
    }
  };
`;

code = code.replace(
  "const pendingPledges = pledges.filter(p => p.status === 'pending');",
  downloadFn + "\n  const pendingPledges = pledges.filter(p => p.status === 'pending');"
);

// 3. Add Download button and ID to receipt content
code = code.replace(
  `<div className="p-8 print:p-0 receipt-content bg-white text-slate-900">`,
  `<div id="receipt-content-to-download" className="p-8 print:p-0 receipt-content bg-white text-slate-900">`
);

const downloadButton = `
                <button
                  onClick={handleDownloadReceipt}
                  className="px-3 py-1.5 bg-emerald-600 text-white text-sm font-bold rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-1"
                >
                  <Download className="w-4 h-4" />
                  הורד
                </button>
`;

code = code.replace(
  `<button\n                  onClick={() => window.print()}`,
  downloadButton + `\n                <button\n                  onClick={() => window.print()}`
);

fs.writeFileSync('src/components/AdminDashboard.tsx', code);
