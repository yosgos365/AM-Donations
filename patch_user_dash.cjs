const fs = require('fs');
let code = fs.readFileSync('src/components/UserDashboard.tsx', 'utf-8');

// Update Yahrzeit title
code = code.replace(
  "יארצייט (תאריכי אזכרה)",
  "יארצייט"
);

code = code.replace(
  "לא הוגדרו תאריכי אזכרה",
  "לא הוגדר יארצייט."
);

// We need to manage state for creating new entities
code = code.replace(
  "const [activeTab, setActiveTab] = useState<'open' | 'history' | 'settings'>('open');",
  "const [activeTab, setActiveTab] = useState<'open' | 'history' | 'settings'>('open');\n  const [isAddingFamilyMember, setIsAddingFamilyMember] = useState(false);\n  const [newFamilyMember, setNewFamilyMember] = useState({ name: '', hebrewDob: { year: 5784, month: 7, day: 1 } });\n  const [isAddingYahrzeit, setIsAddingYahrzeit] = useState(false);\n  const [newYahrzeit, setNewYahrzeit] = useState({ name: '', hebrewDate: { year: 5784, month: 7, day: 1 } });"
);

// Update Add logic
const updatedAddLogic = `
  const handleUpdatePersonalInfo = (field: string, value: any) => {
    onUpdateUser({ ...user, [field]: value });
  };

  const handleSaveFamilyMember = () => {
    if (!newFamilyMember.name.trim()) {
      return;
    }
    const newMember = {
      id: \`fm\${Date.now()}\`,
      name: newFamilyMember.name,
      hebrewDob: newFamilyMember.hebrewDob
    };
    onUpdateUser({
      ...user,
      familyMembers: [...(user.familyMembers || []), newMember]
    });
    setIsAddingFamilyMember(false);
    setNewFamilyMember({ name: '', hebrewDob: { year: 5784, month: 7, day: 1 } });
  };

  const handleUpdateFamilyMember = (id: string, field: string, value: any) => {
    const updated = (user.familyMembers || []).map(fm => 
      fm.id === id ? { ...fm, [field]: value } : fm
    );
    onUpdateUser({ ...user, familyMembers: updated });
  };

  const handleRemoveFamilyMember = (id: string) => {
    onUpdateUser({
      ...user,
      familyMembers: (user.familyMembers || []).filter(fm => fm.id !== id)
    });
  };

  const handleSaveYahrzeit = () => {
    if (!newYahrzeit.name.trim()) {
      return;
    }
    const newYz = {
      id: \`yz\${Date.now()}\`,
      name: newYahrzeit.name,
      hebrewDate: newYahrzeit.hebrewDate
    };
    onUpdateUser({
      ...user,
      yahrzeits: [...(user.yahrzeits || []), newYz]
    });
    setIsAddingYahrzeit(false);
    setNewYahrzeit({ name: '', hebrewDate: { year: 5784, month: 7, day: 1 } });
  };

  const handleUpdateYahrzeit = (id: string, field: string, value: any) => {
    const updated = (user.yahrzeits || []).map(yz => 
      yz.id === id ? { ...yz, [field]: value } : yz
    );
    onUpdateUser({ ...user, yahrzeits: updated });
  };

  const handleRemoveYahrzeit = (id: string) => {
    onUpdateUser({
      ...user,
      yahrzeits: (user.yahrzeits || []).filter(yz => yz.id !== id)
    });
  };
`;

code = code.replace(
  /const handleUpdatePersonalInfo = \([\s\S]*?handleRemoveYahrzeit = \(id: string\) => \{[\s\S]*?\};\n/g,
  updatedAddLogic + "\n"
);

// Ensure the UI calls these new handlers. Let's find where onClick={handleAddFamilyMember} is and replace the section.
// This is somewhat complex, let's just do targeted string replaces.

// For Family Members:
code = code.replace(
  "onClick={handleAddFamilyMember}",
  "onClick={() => setIsAddingFamilyMember(true)}"
);

const newFamilyMemberUI = `
                {isAddingFamilyMember && (
                  <div className="p-4 bg-indigo-50/50 rounded-lg border border-indigo-100 relative">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-medium text-indigo-900">הוספת בן/בת משפחה</h4>
                      <button onClick={() => setIsAddingFamilyMember(false)} className="text-slate-400 hover:text-slate-600 text-sm">ביטול</button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">שם בן/בת המשפחה</label>
                        <input
                          type="text"
                          required
                          value={newFamilyMember.name}
                          onChange={(e) => setNewFamilyMember({ ...newFamilyMember, name: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-white"
                          placeholder="שם (חובה)"
                        />
                      </div>
                      <div>
                        <HebrewDatePicker
                          label="תאריך לידה עברי"
                          value={newFamilyMember.hebrewDob}
                          onChange={(val) => setNewFamilyMember({ ...newFamilyMember, hebrewDob: val })}
                        />
                      </div>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={handleSaveFamilyMember}
                        disabled={!newFamilyMember.name.trim()}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-700 transition-colors"
                      >
                        שמור בן משפחה
                      </button>
                    </div>
                  </div>
                )}
`;

code = code.replace(
  "              <div className=\"space-y-4\">\n                {(!user.familyMembers || user.familyMembers.length === 0) ? (",
  "              <div className=\"space-y-4\">\n" + newFamilyMemberUI + "\n                {(!user.familyMembers || user.familyMembers.length === 0) ? ("
);

// For Yahrzeits:
code = code.replace(
  "onClick={handleAddYahrzeit}",
  "onClick={() => setIsAddingYahrzeit(true)}"
);

const newYahrzeitUI = `
                {isAddingYahrzeit && (
                  <div className="p-4 bg-indigo-50/50 rounded-lg border border-indigo-100 relative">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-medium text-indigo-900">הוספת יארצייט</h4>
                      <button onClick={() => setIsAddingYahrzeit(false)} className="text-slate-400 hover:text-slate-600 text-sm">ביטול</button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">שם הנפטר/ת</label>
                        <input
                          type="text"
                          required
                          value={newYahrzeit.name}
                          onChange={(e) => setNewYahrzeit({ ...newYahrzeit, name: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-white"
                          placeholder="שם הנפטר/ת (חובה)"
                        />
                      </div>
                      <div>
                        <HebrewDatePicker
                          label="תאריך פטירה עברי"
                          value={newYahrzeit.hebrewDate}
                          onChange={(val) => setNewYahrzeit({ ...newYahrzeit, hebrewDate: val })}
                        />
                      </div>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={handleSaveYahrzeit}
                        disabled={!newYahrzeit.name.trim()}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-700 transition-colors"
                      >
                        שמור יארצייט
                      </button>
                    </div>
                  </div>
                )}
`;

code = code.replace(
  "              <div className=\"space-y-4\">\n                {(!user.yahrzeits || user.yahrzeits.length === 0) ? (",
  "              <div className=\"space-y-4\">\n" + newYahrzeitUI + "\n                {(!user.yahrzeits || user.yahrzeits.length === 0) ? ("
);

// Prevent removing names completely from existing records.
// We can't strictly block it onChange unless we handle it, but we can visually indicate it. For now, the user requested:
// "בהופסת בן משפחה או יארצייט ללא שם ההוספה לא תשמר. כלומר אסור להשאיר שדה ריק בשם."
// The new logic accomplishes this perfectly by requiring the name before saving into the array.

// Add Logo to Header
code = code.replace(
  "<div className=\"w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center\">\n                <FileText className=\"w-5 h-5 text-indigo-600\" />\n              </div>",
  "<img src=\"https://raw.githubusercontent.com/yosgos365/AM-Donations/main/Logo.jpeg\" alt=\"אחוות מנחם\" className=\"w-10 h-10 rounded-full object-cover border border-indigo-100\" />"
);

fs.writeFileSync('src/components/UserDashboard.tsx', code);
