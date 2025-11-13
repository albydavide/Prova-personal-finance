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
      <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 overflow-hidden hover:shadow-2xl transition-all duration-300">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
          <h2 className="text-2xl font-bold text-white">💰 Bilanciamento di Coppia</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="group">
              <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-6 rounded-2xl border-2 border-green-200 hover:border-green-400 transition-all duration-300 hover:scale-105 hover:shadow-lg">
                <p className="text-sm text-green-700 font-medium mb-2">Entrate Totali</p>
                <p className="text-3xl font-bold text-green-600">
                  {formatCurrency(balance.couple.totalIncome)}
                </p>
              </div>
            </div>
            <div className="group">
              <div className="bg-gradient-to-br from-red-50 to-pink-100 p-6 rounded-2xl border-2 border-red-200 hover:border-red-400 transition-all duration-300 hover:scale-105 hover:shadow-lg">
                <p className="text-sm text-red-700 font-medium mb-2">Spese Totali</p>
                <p className="text-3xl font-bold text-red-600">
                  {formatCurrency(balance.couple.totalExpenses)}
                </p>
              </div>
            </div>
            <div className="group">
              <div className="bg-gradient-to-br from-blue-50 to-cyan-100 p-6 rounded-2xl border-2 border-blue-200 hover:border-blue-400 transition-all duration-300 hover:scale-105 hover:shadow-lg">
                <p className="text-sm text-blue-700 font-medium mb-2">Investimenti Totali</p>
                <p className="text-3xl font-bold text-blue-600">
                  {formatCurrency(balance.couple.totalInvestments)}
                </p>
              </div>
            </div>
            <div className="group">
              <div className={`bg-gradient-to-br ${balance.couple.balance >= 0 ? 'from-green-50 to-emerald-100 border-green-200 hover:border-green-400' : 'from-red-50 to-pink-100 border-red-200 hover:border-red-400'} p-6 rounded-2xl border-2 transition-all duration-300 hover:scale-105 hover:shadow-lg`}>
                <p className="text-sm font-medium mb-2" style={{ color: balance.couple.balance >= 0 ? '#15803d' : '#dc2626' }}>Saldo Coppia</p>
                <p className={`text-3xl font-bold ${balance.couple.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(balance.couple.balance)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Spese condivise */}
      <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 overflow-hidden hover:shadow-2xl transition-all duration-300">
        <div className="bg-gradient-to-r from-orange-500 to-pink-600 p-6">
          <h2 className="text-2xl font-bold text-white">🤝 Spese Condivise</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-orange-50 to-amber-100 p-4 rounded-2xl border-2 border-orange-200">
                <p className="text-sm text-orange-700 font-medium">{balance.partner1.name} ha pagato</p>
                <p className="text-2xl font-bold text-orange-600 mt-2">{formatCurrency(balance.sharedBalance.partner1Paid)}</p>
              </div>
              <div className="bg-gradient-to-br from-pink-50 to-rose-100 p-4 rounded-2xl border-2 border-pink-200">
                <p className="text-sm text-pink-700 font-medium">{balance.partner2.name} ha pagato</p>
                <p className="text-2xl font-bold text-pink-600 mt-2">{formatCurrency(balance.sharedBalance.partner2Paid)}</p>
              </div>
            </div>
            <div className="bg-gradient-to-r from-purple-50 to-indigo-100 p-4 rounded-2xl border-2 border-purple-200">
              <p className="text-sm text-purple-700 font-medium">Totale spese condivise</p>
              <p className="text-3xl font-bold text-purple-600 mt-2">{formatCurrency(balance.sharedBalance.totalSharedExpenses)}</p>
            </div>
            {balance.sharedBalance.amount > 0 && (
              <div className="relative mt-4 p-6 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl border-2 border-orange-300 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-300 rounded-full -mr-16 -mt-16 opacity-20"></div>
                <div className="relative">
                  <p className="text-lg font-semibold text-orange-800">
                    {balance.sharedBalance.whoOwes}
                  </p>
                  <p className="text-3xl font-bold text-orange-600 mt-2">
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
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-blue-200 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105">
          <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-5">
            <h3 className="text-2xl font-bold text-white">{balance.partner1.name}</h3>
          </div>
          <div className="p-6 space-y-3">
            <div className="flex justify-between items-center p-3 rounded-xl bg-green-50 hover:bg-green-100 transition-colors">
              <span className="text-gray-700 font-medium">Entrate:</span>
              <span className="font-bold text-green-600 text-lg">
                {formatCurrency(balance.partner1.totalIncome)}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-xl bg-red-50 hover:bg-red-100 transition-colors">
              <span className="text-gray-700 font-medium">Spese personali:</span>
              <span className="font-bold text-red-600 text-lg">
                -{formatCurrency(balance.partner1.totalPersonalExpenses)}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-xl bg-orange-50 hover:bg-orange-100 transition-colors">
              <span className="text-gray-700 font-medium">Spese condivise (50%):</span>
              <span className="font-bold text-orange-600 text-lg">
                -{formatCurrency(balance.partner1.totalSharedExpenses)}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors">
              <span className="text-gray-700 font-medium">Investimenti:</span>
              <span className="font-bold text-blue-600 text-lg">
                -{formatCurrency(balance.partner1.totalInvestments)}
              </span>
            </div>
            <div className={`flex justify-between items-center p-4 rounded-xl border-2 ${balance.partner1.balance >= 0 ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'} mt-4`}>
              <span className="font-bold text-gray-800 text-lg">Saldo:</span>
              <span className={`text-2xl font-bold ${balance.partner1.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(balance.partner1.balance)}
              </span>
            </div>
          </div>
        </div>

        {/* Partner 2 */}
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-pink-200 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105">
          <div className="bg-gradient-to-r from-pink-500 to-rose-500 p-5">
            <h3 className="text-2xl font-bold text-white">{balance.partner2.name}</h3>
          </div>
          <div className="p-6 space-y-3">
            <div className="flex justify-between items-center p-3 rounded-xl bg-green-50 hover:bg-green-100 transition-colors">
              <span className="text-gray-700 font-medium">Entrate:</span>
              <span className="font-bold text-green-600 text-lg">
                {formatCurrency(balance.partner2.totalIncome)}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-xl bg-red-50 hover:bg-red-100 transition-colors">
              <span className="text-gray-700 font-medium">Spese personali:</span>
              <span className="font-bold text-red-600 text-lg">
                -{formatCurrency(balance.partner2.totalPersonalExpenses)}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-xl bg-orange-50 hover:bg-orange-100 transition-colors">
              <span className="text-gray-700 font-medium">Spese condivise (50%):</span>
              <span className="font-bold text-orange-600 text-lg">
                -{formatCurrency(balance.partner2.totalSharedExpenses)}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors">
              <span className="text-gray-700 font-medium">Investimenti:</span>
              <span className="font-bold text-blue-600 text-lg">
                -{formatCurrency(balance.partner2.totalInvestments)}
              </span>
            </div>
            <div className={`flex justify-between items-center p-4 rounded-xl border-2 ${balance.partner2.balance >= 0 ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'} mt-4`}>
              <span className="font-bold text-gray-800 text-lg">Saldo:</span>
              <span className={`text-2xl font-bold ${balance.partner2.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(balance.partner2.balance)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
