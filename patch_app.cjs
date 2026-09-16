const fs = require('fs');

let code = fs.readFileSync('src/App.tsx', 'utf-8');

// Imports
code = code.replace(
  "import { AdminDashboard } from './components/AdminDashboard';",
  "import { AdminDashboard } from './components/AdminDashboard';\nimport { Registration } from './components/Registration';\nimport { HebrewDateValue } from './components/HebrewDatePicker';"
);

// State for registration
code = code.replace(
  "const [loginError, setLoginError] = useState<string>('');",
  "const [loginError, setLoginError] = useState<string>('');\n  const [registeringPhone, setRegisteringPhone] = useState<string | null>(null);"
);

// Login handler
code = code.replace(
  /const handleLogin = \(phone: string\) => \{[\s\S]*?\};\n/g,
  `const handleLogin = (phone: string) => {
    setLoginError('');
    const user = users.find(u => u.phone === phone);
    if (user) {
      setCurrentUser(user);
    } else {
      setRegisteringPhone(phone);
    }
  };\n`
);

// Registration handler
const registerHandler = `
  const handleRegister = (newUserData: { name: string; phone: string; hebrewDob: HebrewDateValue }) => {
    const newUser: User = {
      id: \`u\${Date.now()}\`,
      name: newUserData.name,
      phone: newUserData.phone,
      hebrewDob: newUserData.hebrewDob,
      role: 'user'
    };
    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    setRegisteringPhone(null);
  };
`;

code = code.replace(
  "const handleAdminLogin",
  registerHandler + "\n  const handleAdminLogin"
);

// Add updateUser logic for UserDashboard (for Settings)
code = code.replace(
  "const handleUpdateUser = (id: string, name: string, phone: string) => {",
  "const handleUpdateUserFull = (updatedUser: User) => {\n    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));\n    if (currentUser?.id === updatedUser.id) setCurrentUser(updatedUser);\n  };\n\n  const handleUpdateUser = (id: string, name: string, phone: string) => {"
);

// Pass handleUpdateUserFull to UserDashboard
code = code.replace(
  "onSubmitPayment={handleSubmitPayment}",
  "onSubmitPayment={handleSubmitPayment}\n      onUpdateUser={handleUpdateUserFull}"
);


// Render registration if registeringPhone is set
const renderLogic = `
  if (registeringPhone) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4" dir="rtl">
        <Registration 
          initialPhone={registeringPhone} 
          onRegister={handleRegister} 
          onCancel={() => { setRegisteringPhone(null); setLoginError(''); }} 
        />
      </div>
    );
  }

  if (!currentUser) {
`;

code = code.replace(
  "if (!currentUser) {",
  renderLogic
);

fs.writeFileSync('src/App.tsx', code);
