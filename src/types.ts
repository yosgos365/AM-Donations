export interface User {
  id: string;
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
