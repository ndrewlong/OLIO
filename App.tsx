
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Customers from './components/Customers';
import Suppliers from './components/Suppliers';
import Products from './components/Products';
import Transactions from './components/Transactions';
import Header from './components/Header';
import Login from './components/Login';
import Settings from './components/Settings';
import { View, Customer, Supplier, Product, Transaction, TransactionType, User, UserRole } from './types';

const App: React.FC = () => {
  // --- Authentication State ---
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([
      { id: 'user_admin_01', username: 'admin', password: 'password', role: UserRole.Admin },
      { id: 'user_viewer_01', username: 'viewer', password: 'password', role: UserRole.Viewer },
  ]);
  const [loginError, setLoginError] = useState('');
  
  const [activeView, setActiveView] = useState<View>(View.Dashboard);

  // --- Centralized State ---
  const [customers, setCustomers] = useState<Customer[]>([
    { id: '1', name: 'Mario Rossi', email: 'mario.rossi@email.com', phone: '3331234567', address: 'Via Roma 1, Milano', joinDate: '2023-01-15', lastPurchaseDate: '2024-07-10' },
    { id: '2', name: 'Giulia Bianchi', email: 'giulia.bianchi@email.com', phone: '3477654321', address: 'Corso Vittorio Emanuele 10, Roma', joinDate: '2023-03-22', lastPurchaseDate: '2024-06-25' },
    { id: '3', name: 'Luca Verdi', email: 'luca.verdi@email.com', phone: '3289876543', address: 'Piazza del Duomo 5, Firenze', joinDate: '2023-05-10' },
  ]);

  const [suppliers, setSuppliers] = useState<Supplier[]>([
    { id: '1', name: 'Fattoria Verde', contactPerson: 'Paolo Neri', email: 'info@fattoriaverde.it', phone: '0511234567', productSupplied: 'Olive Biologiche' },
    { id: '2', name: 'Vetreria Artigiana', contactPerson: 'Anna Gialli', email: 'anna@vetreria.com', phone: '0298765432', productSupplied: 'Bottiglie di vetro' },
    { id: '3', name: 'Tipografia Moderna', contactPerson: 'Marco Bruni', email: 'marco@tipomoderna.it', phone: '0655544331', productSupplied: 'Etichette personalizzate' },
  ]);

  const [productTypes, setProductTypes] = useState<string[]>(['Extra Vergine', 'Aromatizzato', 'Biologico']);
  const [packagingTypes, setPackagingTypes] = useState<string[]>(['Lattina 5L', 'Lattina 3L', 'Bottiglia Vetro 750ml']);

  const [products, setProducts] = useState<Product[]>([
    { id: '1', name: 'Classico', type: 'Extra Vergine', packaging: 'Lattina 5L', description: 'Olio extra vergine di oliva dal gusto equilibrato.', pricePerLiter: 12.50, stock: { emilia: 200, calabria: 300 }, isActive: true },
    { id: '2', name: 'Limone', type: 'Aromatizzato', packaging: 'Bottiglia Vetro 750ml', description: 'Olio aromatizzato al limone fresco di Sicilia.', pricePerLiter: 15.00, stock: { emilia: 100, calabria: 100 }, isActive: true },
    { id: '3', name: 'Bio', type: 'Biologico', packaging: 'Lattina 3L', description: 'Olio biologico certificato, spremitura a freddo.', pricePerLiter: 18.00, stock: { emilia: 50, calabria: 100 }, isActive: false },
  ]);

  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: '1', type: TransactionType.Income, description: 'Vendita a Mario Rossi', amount: 250.00, date: '2024-07-20' },
    { id: '2', type: TransactionType.Expense, description: 'Acquisto bottiglie da Vetreria Artigiana', amount: 120.00, date: '2024-07-19' },
    { id: '3', type: TransactionType.Income, description: 'Vendita a Giulia Bianchi', amount: 150.00, date: '2024-07-18' },
    { id: '4', type: TransactionType.Expense, description: 'Pagamento etichette Tipografia Moderna', amount: 80.00, date: '2024-07-17' },
  ]);

  // --- Handlers ---
  const handleLogin = (user: string, pass: string) => {
    const foundUser = users.find(u => u.username === user && u.password === pass);
    if (foundUser) {
      setCurrentUser(foundUser);
      setLoginError('');
    } else {
      setLoginError('Username o password non validi.');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveView(View.Dashboard);
  };

  const renderView = () => {
    if (!currentUser) return null; // Should not happen if authenticated
    switch (activeView) {
      case View.Dashboard:
        return <Dashboard customers={customers} transactions={transactions} products={products} />;
      case View.Customers:
        return <Customers customers={customers} setCustomers={setCustomers} userRole={currentUser.role} />;
      case View.Suppliers:
        return <Suppliers suppliers={suppliers} setSuppliers={setSuppliers} userRole={currentUser.role} />;
      case View.Products:
        return <Products products={products} setProducts={setProducts} productTypes={productTypes} packagingTypes={packagingTypes} userRole={currentUser.role} />;
      case View.Transactions:
        return <Transactions transactions={transactions} setTransactions={setTransactions} userRole={currentUser.role} />;
      case View.Settings:
        return <Settings 
          currentUser={currentUser}
          setCurrentUser={setCurrentUser}
          users={users}
          setUsers={setUsers}
          productTypes={productTypes}
          setProductTypes={setProductTypes}
          packagingTypes={packagingTypes}
          setPackagingTypes={setPackagingTypes}
          products={products}
          setProducts={setProducts} 
        />;
      default:
        return <Dashboard customers={customers} transactions={transactions} products={products} />;
    }
  };

  if (!currentUser) {
    return <Login onLogin={handleLogin} error={loginError} />;
  }

  return (
    <div className="flex h-screen bg-brand-background text-gray-800">
      <Sidebar activeView={activeView} setActiveView={setActiveView} onLogout={handleLogout} currentUser={currentUser} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header currentView={activeView} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6 lg:p-8 bg-brand-background">
          {renderView()}
        </main>
      </div>
    </div>
  );
};

export default App;