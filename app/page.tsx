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
    try {
      const [partnersRes, balanceRes, allocationsRes] = await Promise.all([
        fetch('/api/partners'),
        fetch('/api/balance'),
        fetch('/api/allocations'),
      ]);

      // Check each response individually for better error messages
      if (!partnersRes.ok) {
        console.error('Partners API failed:', await partnersRes.text());
        throw new Error('Failed to fetch partners');
      }
      if (!balanceRes.ok) {
        console.error('Balance API failed:', await balanceRes.text());
        throw new Error('Failed to fetch balance');
      }
      if (!allocationsRes.ok) {
        console.error('Allocations API failed:', await allocationsRes.text());
        throw new Error('Failed to fetch allocations');
      }

      const partnersData = await partnersRes.json();
      const balanceData = await balanceRes.json();
      const allocationsData = await allocationsRes.json();

      setPartners(partnersData);
      setBalance(balanceData);
      setAllocations(allocationsData);
    } catch (error) {
      console.error('Error loading data:', error);
    }
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-slate-50 to-gray-100">
      {/* Header */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-700 via-slate-800 to-gray-900 opacity-95"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-lg rounded-2xl flex items-center justify-center shadow-lg border border-white/30">
              <Wallet className="text-white" size={32} />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white drop-shadow-lg">Finanza di Coppia</h1>
              <p className="text-gray-200 mt-1 text-lg">
                Gestisci le tue finanze con semplicità ed eleganza
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs - Modern Floating Style */}
      <div className="max-w-7xl mx-auto px-4 -mt-6 relative z-10">
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200 p-2">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex-1 py-3 px-4 rounded-xl font-medium text-sm transition-all duration-300 ${
                activeTab === 'dashboard'
                  ? 'bg-gradient-to-r from-slate-700 to-slate-800 text-white shadow-lg shadow-slate-500/30 scale-105'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Wallet size={18} />
                <span className="hidden sm:inline">Dashboard</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('income')}
              className={`flex-1 py-3 px-4 rounded-xl font-medium text-sm transition-all duration-300 ${
                activeTab === 'income'
                  ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-lg shadow-emerald-500/30 scale-105'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <ArrowLeftRight size={18} />
                <span className="hidden sm:inline">Entrate</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('expenses')}
              className={`flex-1 py-3 px-4 rounded-xl font-medium text-sm transition-all duration-300 ${
                activeTab === 'expenses'
                  ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-500/30 scale-105'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <ArrowLeftRight size={18} />
                <span className="hidden sm:inline">Spese</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('investments')}
              className={`flex-1 py-3 px-4 rounded-xl font-medium text-sm transition-all duration-300 ${
                activeTab === 'investments'
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/30 scale-105'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <TrendingUp size={18} />
                <span className="hidden sm:inline">Investimenti</span>
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
      <footer className="bg-gradient-to-r from-slate-900 to-slate-800 text-white border-t border-slate-700 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center">
          <p className="text-gray-300 text-sm">
            App per la finanza di coppia - Template configurato per: 2500€/mese a testa, split 50/50, 350€/mese investimenti
          </p>
        </div>
      </footer>
    </div>
  );
}
