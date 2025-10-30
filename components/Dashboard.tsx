import React, { useState, useMemo } from 'react';
import { Card } from './ui/Card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Customer, Product, Transaction, TransactionType } from '../types';

interface DashboardProps {
  customers: Customer[];
  transactions: Transaction[];
  products: Product[];
}

const Dashboard: React.FC<DashboardProps> = ({ customers, transactions, products }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedChartYear, setSelectedChartYear] = useState(new Date().getFullYear());


  const totalCustomers = customers.length;
  const activeProducts = products.filter(p => p.isActive).length;

  // --- Monthly Calculations ---
  const monthlyTransactions = useMemo(() => {
    return transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate.getFullYear() === currentDate.getFullYear() &&
             transactionDate.getMonth() === currentDate.getMonth();
    });
  }, [transactions, currentDate]);

  const totalIncome = useMemo(() => {
    return monthlyTransactions
      .filter(t => t.type === TransactionType.Income)
      .reduce((sum, t) => sum + t.amount, 0);
  }, [monthlyTransactions]);

  const totalExpense = useMemo(() => {
    return monthlyTransactions
      .filter(t => t.type === TransactionType.Expense)
      .reduce((sum, t) => sum + t.amount, 0);
  }, [monthlyTransactions]);

  // --- Annual Summary Calculation for the selected year ---
  const annualSummary = useMemo(() => {
    const yearlyTransactions = transactions.filter(t => new Date(t.date).getFullYear() === selectedChartYear);
    
    const income = yearlyTransactions
      .filter(t => t.type === TransactionType.Income)
      .reduce((sum, t) => sum + t.amount, 0);
      
    const expense = yearlyTransactions
      .filter(t => t.type === TransactionType.Expense)
      .reduce((sum, t) => sum + t.amount, 0);

    return { income, expense };
  }, [transactions, selectedChartYear]);


  // --- Chart Data for the selected year ---
  const chartData = useMemo(() => {
    const months = Array.from({ length: 12 }).map((_, i) => {
      const d = new Date(selectedChartYear, i, 1);
      return {
        name: d.toLocaleString('it-IT', { month: 'short' }).replace('.', '').toLocaleUpperCase(),
        Entrate: 0,
        Uscite: 0,
      };
    });

    transactions.forEach(t => {
      const transactionDate = new Date(t.date);
      if (transactionDate.getFullYear() === selectedChartYear) {
        const monthIndex = transactionDate.getMonth();
        if (months[monthIndex]) {
          if (t.type === TransactionType.Income) {
            months[monthIndex].Entrate += t.amount;
          } else {
            months[monthIndex].Uscite += t.amount;
          }
        }
      }
    });
    return months;
  }, [transactions, selectedChartYear]);

  // --- Recent Transactions ---
  const recentTransactions = useMemo(() => {
      return [...transactions]
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 5);
  }, [transactions]);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handlePrevChartYear = () => {
    setSelectedChartYear(prevYear => prevYear - 1);
  };

  const handleNextChartYear = () => {
    setSelectedChartYear(prevYear => prevYear + 1);
  };

  const currentMonthLabel = currentDate.toLocaleString('it-IT', {
    month: 'long',
    year: 'numeric'
  });

  const formatDate = (dateString: string) => {
    if (!dateString || dateString.split('-').length !== 3) return dateString || '';
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };


  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-700 hidden lg:block">Dashboard</h2>
      
      {/* General Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Card title="Clienti Totali" value={totalCustomers.toString()} icon="users" />
        <Card title="Prodotti Attivi" value={activeProducts.toString()} icon="products" />
      </div>

      {/* Monthly Section */}
      <div className="flex justify-between items-center pt-4">
        <h3 className="text-2xl font-semibold text-gray-700">Riepilogo Mensile</h3>
        <div className="flex items-center space-x-2 bg-white p-2 rounded-lg shadow-md">
          <button onClick={handlePrevMonth} className="p-2 rounded-md hover:bg-gray-100 transition-colors duration-200" aria-label="Mese precedente">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <span className="font-semibold text-gray-700 w-36 text-center capitalize">{currentMonthLabel}</span>
          <button onClick={handleNextMonth} className="p-2 rounded-md hover:bg-gray-100 transition-colors duration-200" aria-label="Mese successivo">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      </div>
      
      {/* Monthly Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Card title="Entrate (Mese)" value={`€ ${totalIncome.toFixed(2)}`} icon="income" />
        <Card title="Uscite (Mese)" value={`€ ${totalExpense.toFixed(2)}`} icon="expense" />
      </div>

      {/* Annual Summary */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-700">Riepilogo Annuale</h3>
            <div className="flex items-center space-x-2">
            <button onClick={handlePrevChartYear} className="p-2 rounded-md hover:bg-gray-100 transition-colors duration-200" aria-label="Anno precedente">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <span className="font-semibold text-gray-700 w-20 text-center">{selectedChartYear}</span>
            <button onClick={handleNextChartYear} className="p-2 rounded-md hover:bg-gray-100 transition-colors duration-200" aria-label="Anno successivo">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
            </div>
        </div>
        <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="text-md font-medium text-green-800">Entrate Totali</span>
                <span className="font-bold text-lg text-green-700">€ {annualSummary.income.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                <span className="text-md font-medium text-red-800">Uscite Totali</span>
                <span className="font-bold text-lg text-red-700">€ {annualSummary.expense.toFixed(2)}</span>
            </div>
              <div className="flex justify-between items-center p-3 bg-gray-100 rounded-lg border-t-2 mt-2">
                <span className="text-md font-bold text-gray-800">Risultato Netto</span>
                <span className={`font-bold text-xl ${(annualSummary.income - annualSummary.expense) >= 0 ? 'text-gray-800' : 'text-red-600'}`}>
                    € {(annualSummary.income - annualSummary.expense).toFixed(2)}
                </span>
            </div>
        </div>
      </div>

      {/* Chart and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-700">Panoramica Finanziaria Annuale</h3>
            <div className="flex items-center space-x-2">
              <button onClick={handlePrevChartYear} className="p-2 rounded-md hover:bg-gray-100 transition-colors duration-200" aria-label="Anno precedente">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              </button>
              <span className="font-semibold text-gray-700 w-20 text-center">{selectedChartYear}</span>
              <button onClick={handleNextChartYear} className="p-2 rounded-md hover:bg-gray-100 transition-colors duration-200" aria-label="Anno successivo">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value: number) => `€${value.toFixed(2)}`} />
              <Legend />
              <Bar dataKey="Entrate" fill="#4A6D4D" />
              <Bar dataKey="Uscite" fill="#dc2626" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Attività Recenti</h3>
          {recentTransactions.length > 0 ? (
            <ul className="space-y-4">
                {recentTransactions.map(t => (
                    <li key={t.id} className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${t.type === TransactionType.Income ? 'bg-green-100' : 'bg-red-100'}`}>
                        <span className={`font-bold ${t.type === TransactionType.Income ? 'text-green-600' : 'text-red-600'}`}>
                            {t.type === TransactionType.Income ? '+' : '-'}
                        </span>
                    </div>
                    <div>
                        <p className="font-medium text-gray-800">{t.description}</p>
                        <p className="text-sm text-gray-500">€ {t.amount.toFixed(2)} - {formatDate(t.date)}</p>
                    </div>
                    </li>
                ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">Nessuna transazione recente.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;