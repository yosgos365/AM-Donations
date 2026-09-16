import React, { useState } from 'react';
import { initialUsers, initialPledges } from './data';
import { User, Pledge } from './types';
import { Login } from './components/Login';
import { UserDashboard } from './components/UserDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { Registration } from './components/Registration';
import { HebrewDateValue } from './components/HebrewDatePicker';

export default function App() {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [pledges, setPledges] = useState<Pledge[]>(initialPledges);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loginError, setLoginError] = useState<string>('');
  const [registeringPhone, setRegisteringPhone] = useState<string | null>(null);

  const handleLogin = (phone: string) => {
    setLoginError('');
    const user = users.find(u => u.phone === phone);
    if (user) {
      setCurrentUser(user);
    } else {
      setRegisteringPhone(phone);
    }
  };

  
  const handleRegister = (newUserData: { name: string; phone: string; hebrewDob: HebrewDateValue }) => {
    const newUser: User = {
      id: `u${Date.now()}`,
      name: newUserData.name,
      phone: newUserData.phone,
      hebrewDob: newUserData.hebrewDob,
      role: 'user'
    };
    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    setRegisteringPhone(null);
  };

  const handleAdminLogin = (password: string) => {
    setLoginError('');
    if (password === '1111') {
      const adminUser = users.find(u => u.role === 'admin') || initialUsers[1];
      setCurrentUser(adminUser);
    } else {
      setLoginError('סיסמת מנהל שגויה.');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const handleSubmitPayment = (pledgeIds: string[], method: 'paybox' | 'bank', file: File | null) => {
    setPledges(prev => prev.map(p => {
      if (pledgeIds.includes(p.id)) {
        return {
          ...p,
          status: 'pending',
          paymentMethod: method,
          receiptImage: file ? file.name : 'אסמכתא.jpg',
          paidAt: new Date().toISOString()
        };
      }
      return p;
    }));
  };

  const handleApprovePledge = (id: string) => {
    setPledges(prev => prev.map(p => {
      if (p.id === id) {
        return {
          ...p,
          status: 'paid',
          approvedAt: new Date().toISOString(),
          receiptNumber: `INV-${Math.floor(Math.random() * 10000)}`
        };
      }
      return p;
    }));
  };
  const handleAddPledge = (pledgeData: Partial<Pledge>, userName: string, phone: string) => {
    let targetUser = users.find(u => u.phone === phone);
    
    // Create guest user if doesn't exist
    if (!targetUser) {
      targetUser = {
        id: `u${Date.now()}`,
        name: userName,
        phone: phone,
        role: 'user'
      };
      setUsers(prev => [...prev, targetUser!]);
    }

    const newPledge: Pledge = {
      id: `p${Date.now()}`,
      userId: targetUser.id,
      type: pledgeData.type || 'אחר',
      amount: pledgeData.amount || 0,
      date: pledgeData.date || new Date().toISOString(),
      status: 'open'
    };

    setPledges(prev => [newPledge, ...prev]);
  };

  const handleUpdateUserFull = (updatedUser: User) => {
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    if (currentUser?.id === updatedUser.id) setCurrentUser(updatedUser);
  };

  const handleUpdateUser = (id: string, name: string, phone: string) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, name, phone } : u));
  };

  const handleAddUser = (name: string, phone: string) => {
    const newUser: User = {
      id: `u${Date.now()}`,
      name,
      phone,
      role: 'user'
    };
    setUsers(prev => [...prev, newUser]);
  };

  
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

    return <Login onLogin={handleLogin} onAdminLogin={handleAdminLogin} error={loginError} />;
  }

  if (currentUser.role === 'admin') {
    return (
      <AdminDashboard 
        user={currentUser} 
        users={users} 
        pledges={pledges} 
        onLogout={handleLogout}
        onApprovePledge={handleApprovePledge}
        onAddPledge={handleAddPledge}
        onUpdateUser={handleUpdateUser}
        onAddUser={handleAddUser}
      />
    );
  }

  return (
    <UserDashboard 
      user={currentUser} 
      pledges={pledges.filter(p => p.userId === currentUser.id)} 
      onLogout={handleLogout}
      onSubmitPayment={handleSubmitPayment}
      onUpdateUser={handleUpdateUserFull}
    />
  );
}
