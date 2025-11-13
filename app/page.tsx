'use client';

import { useEffect, useState } from 'react';
import { Partner, BalanceData, InvestmentAllocation } from '@/lib/types';
import { IncomeForm } from '@/components/IncomeForm';
import { ExpenseForm } from '@/components/ExpenseForm';
import { InvestmentForm } from '@/components/InvestmentForm';
import { BalanceView } from '@/components/BalanceView';
import { InvestmentDashboard } from '@/components/InvestmentDashboard';
import { Wallet, TrendingUp, ArrowLeftRight } from 'lucide-react';

export default function Home() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [balance, setBalance] = useState<BalanceData | null>(null);
  const [allocations, setAllocations] = useState<InvestmentAllocation[]>([]);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'income' | 'expenses' | 'investments'>('dashboard');

  const loadData = async () => {
    const [partnersRes, balanceRes, allocationsRes] = await Promise.all([
      fetch('/api/partners'),
      fetch('/api/balance'),
      fetch('/api/allocations'),
    ]);

    const partnersData = await partnersRes.json();
    const balanceData = await balanceRes.json();
    const allocationsData = await allocationsRes.json();

    setPartners(partnersData);
    setBalance(balanceData);
    setAllocations(allocationsData);
  };

  useEffect(() => {
    loadData();
  }, []);

  if (!balance || partners.length === 0 || allocations.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Caricamento...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold">Finanza di Coppia</h1>
          <p className="text-blue-100 mt-1">
            Gestisci le tue finanze personali e di coppia con semplicità
          </p>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'dashboard'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <Wallet size={18} />
                Dashboard
              </div>
            </button>
            <button
              onClick={() => setActiveTab('income')}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'income'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <ArrowLeftRight size={18} />
                Entrate
              </div>
            </button>
            <button
              onClick={() => setActiveTab('expenses')}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'expenses'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <ArrowLeftRight size={18} />
                Spese
              </div>
            </button>
            <button
              onClick={() => setActiveTab('investments')}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'investments'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <TrendingUp size={18} />
                Investimenti
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            <BalanceView balance={balance} />
            <InvestmentDashboard allocations={allocations} monthlyInvestment={350} />
          </div>
        )}

        {activeTab === 'income' && (
          <div className="max-w-2xl mx-auto">
            <IncomeForm partners={partners} onAdd={loadData} />
          </div>
        )}

        {activeTab === 'expenses' && (
          <div className="max-w-2xl mx-auto">
            <ExpenseForm partners={partners} onAdd={loadData} />
          </div>
        )}

        {activeTab === 'investments' && (
          <div className="space-y-8">
            <div className="max-w-2xl mx-auto">
              <InvestmentForm
                partners={partners}
                allocations={allocations}
                onAdd={loadData}
              />
            </div>
            <InvestmentDashboard allocations={allocations} monthlyInvestment={350} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-gray-600 text-sm">
          <p>
            App per la finanza di coppia - Template configurato per: 2500€/mese a testa, split 50/50, 350€/mese investimenti
          </p>
        </div>
      </footer>
    </div>
  );
}
