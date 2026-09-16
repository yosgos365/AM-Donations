export interface HebrewDateValue {
  year: number;
  month: number;
  day: number;
}

export interface FamilyMember {
  id: string;
  name: string;
  hebrewDob: HebrewDateValue;
}

export interface Yahrzeit {
  id: string;
  name: string;
  hebrewDate: HebrewDateValue;
}

export interface User {
  id: string;
  hebrewDob?: HebrewDateValue;
  familyMembers?: FamilyMember[];
  yahrzeits?: Yahrzeit[];
  phone: string;
  name: string;
  role: 'admin' | 'user';
}

export interface Pledge {
  id: string;
  userId: string;
  type: string;
  amount: number;
  date: string;
  status: 'open' | 'pending' | 'paid';
  paymentMethod?: 'paybox' | 'bank' | 'cash';
  receiptImage?: string;
  paidAt?: string;
  approvedAt?: string;
  receiptNumber?: string;
}
