const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

// Add onImportBulkPledges to AdminDashboard props
code = code.replace(
  "onAddPledge={handleAddPledge}",
  "onAddPledge={handleAddPledge}\n        onImportBulkPledges={handleImportBulkPledges}"
);

// Define handleImportBulkPledges
const bulkHandler = `
  const handleImportBulkPledges = (parsedRows: { name: string; phone: string; type: string; amount: number; date: string }[]) => {
    let currentUsers = [...users];
    const newPledges: Pledge[] = [];
    
    for (const row of parsedRows) {
      let targetUser = currentUsers.find(u => u.phone === row.phone);
      if (!targetUser) {
        targetUser = {
          id: \`u\${Date.now()}_\${Math.random().toString(36).substring(2, 9)}\`,
          name: row.name,
          phone: row.phone,
          role: 'user'
        };
        currentUsers.push(targetUser);
      }
      
      newPledges.push({
        id: \`p\${Date.now()}_\${Math.random().toString(36).substring(2, 9)}\`,
        userId: targetUser.id,
        type: row.type,
        amount: row.amount,
        date: row.date,
        status: 'open'
      });
    }
    
    setUsers(currentUsers);
    setPledges(prev => [...newPledges, ...prev]);
  };
`;

code = code.replace(
  "const handleAddPledge = ",
  bulkHandler + "\n  const handleAddPledge = "
);

fs.writeFileSync('src/App.tsx', code);
