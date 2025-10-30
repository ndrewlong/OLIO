
export enum View {
  Dashboard = 'Dashboard',
  Customers = 'Clienti',
  Suppliers = 'Fornitori',
  Products = 'Prodotti',
  Transactions = 'Finanze',
  Settings = 'Impostazioni',
}

export enum UserRole {
  Admin = 'Admin',
  Viewer = 'Visualizzatore',
}

export interface User {
  id: string;
  username: string;
  password: string; // In a real app, this should be a hash.
  role: UserRole;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  joinDate: string;
  lastPurchaseDate?: string;
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  productSupplied: string;
}

export interface Product {
  id: string;
  name: string;
  type: string;
  packaging: string;
  description: string;
  pricePerLiter: number;
  stock: {
    emilia: number;
    calabria: number;
  };
  isActive: boolean;
}

export enum TransactionType {
  Income = 'Entrata',
  Expense = 'Uscita',
}

export interface Transaction {
  id: string;
  type: TransactionType;
  description: string;
  amount: number;
  date: string;
}