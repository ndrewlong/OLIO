import React, { useState, useEffect } from 'react';
import { Users, Package, TrendingUp, DollarSign, Truck } from 'lucide-react';
import { getCustomers } from '../services/customerService';
import { getSuppliers } from '../services/supplierService';
import { getProducts } from '../services/productService';
import { getTransactions, getTotalIncome, getTotalExpenses, getBalance } from '../services/transactionService';

interface StatCard {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    customers: 0,
    suppliers: 0,
    products: 0,
    totalStock: 0,
    income: 0,
    expenses: 0,
    balance: 0
  });
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Carica tutti i dati in parallelo
      const [customers, suppliers, products, transactions, income, expenses, balance] = await Promise.all([
        getCustomers(),
        getSuppliers(),
        getProducts(),
        getTransactions(),
        getTotalIncome(),
        getTotalExpenses(),
        getBalance()
      ]);

      // Calcola stock totale
      const totalStock = products.reduce((sum, p) => sum + p.stock, 0);

      setStats({
        customers: customers.length,
        suppliers: suppliers.length,
        products: products.length,
        totalStock,
        income,
        expenses,
        balance
      });

      // Ultime 5 transazioni
      setRecentTransactions(transactions.slice(0, 5));
    } catch (error) {
      console.error('Errore caricamento dati dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards: StatCard[] = [
    {
      title: 'Clienti Totali',
      value: loading ? '...' : stats.customers,
      icon: <Users className="h-6 w-6" />,
      color: 'emerald'
    },
    {
      title: 'Fornitori',
      value: loading ? '...' : stats.suppliers,
      icon: <Truck className="h-6 w-6" />,
      color: 'blue'
    },
    {
      title: 'Prodotti',
      value: loading ? '...' : stats.products,
      icon: <Package className="h-6 w-6" />,
      color: 'purple'
    },
    {
      title: 'Bilancio',
      value: loading ? '...' : `€${stats.balance.toFixed(2)}`,
      icon: <DollarSign className="h-6 w-6" />,
      color: stats.balance >= 0 ? 'green' : 'red'
    },
  ];

  const getColorClasses = (color: string) => {
    const colors: { [key: string]: { bg: string; text: string } } = {
      emerald: { bg: 'bg-emerald-100', text: 'text-emerald-600' },
      blue: { bg: 'bg-blue-100', text: 'text-blue-600' },
      purple: { bg: 'bg-purple-100', text: 'text-purple-600' },
      green: { bg: 'bg-green-100', text: 'text-green-600' },
      red: { bg: 'bg-red-100', text: 'text-red-600' }
    };
    return colors[color] || colors.emerald;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Panoramica generale del tuo business</p>
      </div>

      {/* Statistiche Principali */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const colors = getColorClasses(stat.color);
          return (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`ml-4 p-3 ${colors.bg} rounded-lg ${colors.text}`}>
                  {stat.icon}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Statistiche Finanziarie Dettagliate */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-green-50 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-green-600">Entrate Totali</h3>
            <TrendingUp className="h-5 w-5 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-green-900">
            {loading ? '...' : `€${stats.income.toFixed(2)}`}
          </p>
        </div>

        <div className="bg-red-50 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-red-600">Uscite Totali</h3>
            <TrendingUp className="h-5 w-5 text-red-600 rotate-180" />
          </div>
          <p className="text-2xl font-bold text-red-900">
            {loading ? '...' : `€${stats.expenses.toFixed(2)}`}
          </p>
        </div>

        <div className="bg-purple-50 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-purple-600">Stock Totale</h3>
            <Package className="h-5 w-5 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-purple-900">
            {loading ? '...' : `${stats.totalStock} unità`}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Transazioni Recenti */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Transazioni Recenti
          </h2>
          <div className="space-y-3">
            {loading ? (
              <p className="text-gray-500 text-sm">Caricamento...</p>
            ) : recentTransactions.length === 0 ? (
              <p className="text-gray-500 text-sm">Nessuna transazione registrata</p>
            ) : (
              recentTransactions.map((transaction, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div className="flex items-start space-x-3">
                    <div className={`flex-shrink-0 w-2 h-2 mt-2 rounded-full ${
                      transaction.type === 'income' ? 'bg-green-500' : 'bg-red-500'
                    }`}></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {transaction.description}
                      </p>
                      <p className="text-xs text-gray-500">
                        {transaction.category} • {new Date(transaction.date).toLocaleDateString('it-IT')}
                      </p>
                    </div>
                  </div>
                  <span className={`text-sm font-semibold ${
                    transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}€{transaction.amount.toFixed(2)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Riepilogo Rapido */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Riepilogo Rapido
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <Users className="h-5 w-5 text-emerald-600" />
                </div>
                <span className="text-sm text-gray-700">Clienti attivi</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">
                {loading ? '...' : stats.customers}
              </span>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Truck className="h-5 w-5 text-blue-600" />
                </div>
                <span className="text-sm text-gray-700">Fornitori attivi</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">
                {loading ? '...' : stats.suppliers}
              </span>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Package className="h-5 w-5 text-purple-600" />
                </div>
                <span className="text-sm text-gray-700">Prodotti in catalogo</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">
                {loading ? '...' : stats.products}
              </span>
            </div>

            <div className="flex items-center justify-between py-3">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${
                  stats.balance >= 0 ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  <DollarSign className={`h-5 w-5 ${
                    stats.balance >= 0 ? 'text-green-600' : 'text-red-600'
                  }`} />
                </div>
                <span className="text-sm text-gray-700">Bilancio corrente</span>
              </div>
              <span className={`text-sm font-semibold ${
                stats.balance >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {loading ? '...' : `€${stats.balance.toFixed(2)}`}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
