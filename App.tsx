import React, { useState } from 'react';
import { Home, Users, Package, DollarSign, Settings as SettingsIcon, Truck, LogOut } from 'lucide-react';
import Dashboard from './components/Dashboard';
import Customers from './components/Customers';
import Suppliers from './components/Suppliers';
import Products from './components/Products';
import Transactions from './components/Transactions';
import Settings from './components/Settings';
import Login from './components/Login';
import { AuthProvider, useAuth } from './contexts/AuthContext';

type Page = 'dashboard' | 'customers' | 'suppliers' | 'products' | 'transactions' | 'settings';

function AppContent() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const { currentUser, userData, loading, logout } = useAuth();

  const menuItems = [
    { id: 'dashboard' as Page, label: 'Dashboard', icon: Home },
    { id: 'customers' as Page, label: 'Clienti', icon: Users },
    { id: 'suppliers' as Page, label: 'Fornitori', icon: Truck },
    { id: 'products' as Page, label: 'Prodotti', icon: Package },
    { id: 'transactions' as Page, label: 'Transazioni', icon: DollarSign },
    { id: 'settings' as Page, label: 'Impostazioni', icon: SettingsIcon },
  ];

  const handleLogout = async () => {
    if (window.confirm('Sei sicuro di voler uscire?')) {
      await logout();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Caricamento...</div>
      </div>
    );
  }

  if (!currentUser) {
    return <Login onLoginSuccess={() => {}} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'customers':
        return <Customers />;
      case 'suppliers':
        return <Suppliers />;
      case 'products':
        return <Products />;
      case 'transactions':
        return <Transactions />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg z-10">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-emerald-600">OLIO</h1>
          <p className="text-sm text-gray-600">Gestione Business</p>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
              <span className="text-emerald-600 font-semibold">
                {userData?.email?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {userData?.displayName || userData?.email}
              </p>
              <p className="text-xs text-gray-500 capitalize">
                {userData?.role}
              </p>
            </div>
          </div>
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  currentPage === item.id
                    ? 'bg-emerald-50 text-emerald-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span className="font-medium">Esci</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">
        {renderPage()}
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
