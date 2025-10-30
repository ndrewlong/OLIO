import React, { useState, useEffect } from 'react';
import { Users, Package, TrendingUp, DollarSign } from 'lucide-react';
import { getCustomers } from '../services/customerService';

interface StatCard {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  trendUp?: boolean;
}

export default function Dashboard() {
  const [customerCount, setCustomerCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const customers = await getCustomers();
      setCustomerCount(customers.length);
    } catch (error) {
      console.error('Errore caricamento dati dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats: StatCard[] = [
    {
      title: 'Clienti Totali',
      value: loading ? '...' : customerCount,
      icon: <Users className="h-6 w-6" />,
    },
    {
      title: 'Prodotti',
      value: '0',
      icon: <Package className="h-6 w-6" />,
    },
    {
      title: 'Vendite Mensili',
      value: '€0',
      icon: <TrendingUp className="h-6 w-6" />,
    },
    {
      title: 'Fatturato',
      value: '€0',
      icon: <DollarSign className="h-6 w-6" />,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Panoramica generale del tuo business</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
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
              <div className="ml-4 p-3 bg-emerald-100 rounded-lg text-emerald-600">
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Attività Recenti
          </h2>
          <div className="space-y-4">
            {loading ? (
              <p className="text-gray-500 text-sm">Caricamento...</p>
            ) : customerCount > 0 ? (
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-2 h-2 mt-2 bg-emerald-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">
                    {customerCount} {customerCount === 1 ? 'cliente registrato' : 'clienti registrati'}
                  </p>
                  <p className="text-xs text-gray-500">Sistema attivo</p>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-sm">Nessuna attività recente</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Vendite Recenti
          </h2>
          <div className="text-center py-8 text-gray-500">
            <p className="text-sm">Nessuna vendita registrata</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Prodotti in Magazzino
        </h2>
        <div className="text-center py-8 text-gray-500">
          <p className="text-sm">Nessun prodotto in magazzino</p>
        </div>
      </div>
    </div>
  );
}
