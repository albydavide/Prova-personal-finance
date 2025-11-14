'use client';

import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { BalanceData } from '@/lib/types';

interface BalanceViewProps {
  balance: BalanceData;
}

export function BalanceView({ balance }: BalanceViewProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Bilanciamento coppia */}
      <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-gray-200 overflow-hidden hover:shadow-2xl transition-all duration-300">
        <div className="bg-gradient-to-r from-slate-700 to-slate-800 p-6">
          <h2 className="text-2xl font-bold text-white">💰 Bilanciamento di Coppia</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="group">
              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-6 rounded-2xl border-2 border-emerald-200 hover:border-emerald-400 transition-all duration-300 hover:scale-105 hover:shadow-lg">
                <p className="text-sm text-emerald-800 font-medium mb-2">Entrate Totali</p>
                <p className="text-3xl font-bold text-emerald-700">
                  {formatCurrency(balance.couple.totalIncome)}
                </p>
              </div>
            </div>
            <div className="group">
              <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-2xl border-2 border-red-200 hover:border-red-400 transition-all duration-300 hover:scale-105 hover:shadow-lg">
                <p className="text-sm text-red-800 font-medium mb-2">Spese Totali</p>
                <p className="text-3xl font-bold text-red-700">
                  {formatCurrency(balance.couple.totalExpenses)}
                </p>
              </div>
            </div>
            <div className="group">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl border-2 border-blue-200 hover:border-blue-400 transition-all duration-300 hover:scale-105 hover:shadow-lg">
                <p className="text-sm text-blue-800 font-medium mb-2">Investimenti Totali</p>
                <p className="text-3xl font-bold text-blue-700">
                  {formatCurrency(balance.couple.totalInvestments)}
                </p>
              </div>
            </div>
            <div className="group">
              <div className={`bg-gradient-to-br ${balance.couple.balance >= 0 ? 'from-emerald-50 to-emerald-100 border-emerald-200 hover:border-emerald-400' : 'from-red-50 to-red-100 border-red-200 hover:border-red-400'} p-6 rounded-2xl border-2 transition-all duration-300 hover:scale-105 hover:shadow-lg`}>
                <p className="text-sm font-medium mb-2" style={{ color: balance.couple.balance >= 0 ? '#065f46' : '#991b1b' }}>Saldo Coppia</p>
                <p className={`text-3xl font-bold ${balance.couple.balance >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
                  {formatCurrency(balance.couple.balance)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Spese condivise */}
      <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-gray-200 overflow-hidden hover:shadow-2xl transition-all duration-300">
        <div className="bg-gradient-to-r from-slate-600 to-slate-700 p-6">
          <h2 className="text-2xl font-bold text-white">🤝 Spese Condivise</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-4 rounded-2xl border-2 border-slate-200">
                <p className="text-sm text-slate-700 font-medium">{balance.partner1.name} ha pagato</p>
                <p className="text-2xl font-bold text-slate-800 mt-2">{formatCurrency(balance.sharedBalance.partner1Paid)}</p>
              </div>
              <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-4 rounded-2xl border-2 border-slate-200">
                <p className="text-sm text-slate-700 font-medium">{balance.partner2.name} ha pagato</p>
                <p className="text-2xl font-bold text-slate-800 mt-2">{formatCurrency(balance.sharedBalance.partner2Paid)}</p>
              </div>
            </div>
            <div className="bg-gradient-to-r from-gray-50 to-slate-100 p-4 rounded-2xl border-2 border-slate-200">
              <p className="text-sm text-slate-700 font-medium">Totale spese condivise</p>
              <p className="text-3xl font-bold text-slate-800 mt-2">{formatCurrency(balance.sharedBalance.totalSharedExpenses)}</p>
            </div>
            {balance.sharedBalance.amount > 0 && (
              <div className="relative mt-4 p-6 bg-gradient-to-r from-amber-100 to-amber-50 rounded-2xl border-2 border-amber-300 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-200 rounded-full -mr-16 -mt-16 opacity-20"></div>
                <div className="relative">
                  <p className="text-lg font-semibold text-amber-900">
                    {balance.sharedBalance.whoOwes}
                  </p>
                  <p className="text-3xl font-bold text-amber-700 mt-2">
                    {formatCurrency(balance.sharedBalance.amount)}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Schede individuali */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Partner 1 */}
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-slate-200 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105">
          <div className="bg-gradient-to-r from-slate-600 to-slate-700 p-5">
            <h3 className="text-2xl font-bold text-white">{balance.partner1.name}</h3>
          </div>
          <div className="p-6 space-y-3">
            <div className="flex justify-between items-center p-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 transition-colors">
              <span className="text-gray-700 font-medium">Entrate:</span>
              <span className="font-bold text-emerald-700 text-lg">
                {formatCurrency(balance.partner1.totalIncome)}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-xl bg-red-50 hover:bg-red-100 transition-colors">
              <span className="text-gray-700 font-medium">Spese personali:</span>
              <span className="font-bold text-red-700 text-lg">
                -{formatCurrency(balance.partner1.totalPersonalExpenses)}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-xl bg-amber-50 hover:bg-amber-100 transition-colors">
              <span className="text-gray-700 font-medium">Spese condivise (50%):</span>
              <span className="font-bold text-amber-700 text-lg">
                -{formatCurrency(balance.partner1.totalSharedExpenses)}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors">
              <span className="text-gray-700 font-medium">Investimenti:</span>
              <span className="font-bold text-blue-700 text-lg">
                -{formatCurrency(balance.partner1.totalInvestments)}
              </span>
            </div>
            <div className={`flex justify-between items-center p-4 rounded-xl border-2 ${balance.partner1.balance >= 0 ? 'bg-emerald-50 border-emerald-300' : 'bg-red-50 border-red-300'} mt-4`}>
              <span className="font-bold text-gray-800 text-lg">Saldo:</span>
              <span className={`text-2xl font-bold ${balance.partner1.balance >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
                {formatCurrency(balance.partner1.balance)}
              </span>
            </div>
          </div>
        </div>

        {/* Partner 2 */}
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-slate-200 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105">
          <div className="bg-gradient-to-r from-slate-600 to-slate-700 p-5">
            <h3 className="text-2xl font-bold text-white">{balance.partner2.name}</h3>
          </div>
          <div className="p-6 space-y-3">
            <div className="flex justify-between items-center p-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 transition-colors">
              <span className="text-gray-700 font-medium">Entrate:</span>
              <span className="font-bold text-emerald-700 text-lg">
                {formatCurrency(balance.partner2.totalIncome)}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-xl bg-red-50 hover:bg-red-100 transition-colors">
              <span className="text-gray-700 font-medium">Spese personali:</span>
              <span className="font-bold text-red-700 text-lg">
                -{formatCurrency(balance.partner2.totalPersonalExpenses)}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-xl bg-amber-50 hover:bg-amber-100 transition-colors">
              <span className="text-gray-700 font-medium">Spese condivise (50%):</span>
              <span className="font-bold text-amber-700 text-lg">
                -{formatCurrency(balance.partner2.totalSharedExpenses)}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors">
              <span className="text-gray-700 font-medium">Investimenti:</span>
              <span className="font-bold text-blue-700 text-lg">
                -{formatCurrency(balance.partner2.totalInvestments)}
              </span>
            </div>
            <div className={`flex justify-between items-center p-4 rounded-xl border-2 ${balance.partner2.balance >= 0 ? 'bg-emerald-50 border-emerald-300' : 'bg-red-50 border-red-300'} mt-4`}>
              <span className="font-bold text-gray-800 text-lg">Saldo:</span>
              <span className={`text-2xl font-bold ${balance.partner2.balance >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
                {formatCurrency(balance.partner2.balance)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
