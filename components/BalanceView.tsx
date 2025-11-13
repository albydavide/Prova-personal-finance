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
      <Card className="bg-gradient-to-br from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle>Bilanciamento di Coppia</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Entrate Totali</p>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(balance.couple.totalIncome)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Spese Totali</p>
              <p className="text-2xl font-bold text-red-600">
                {formatCurrency(balance.couple.totalExpenses)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Investimenti Totali</p>
              <p className="text-2xl font-bold text-blue-600">
                {formatCurrency(balance.couple.totalInvestments)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Saldo Coppia</p>
              <p className={`text-2xl font-bold ${balance.couple.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(balance.couple.balance)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Spese condivise */}
      <Card className="bg-gradient-to-br from-yellow-50 to-orange-50">
        <CardHeader>
          <CardTitle>Spese Condivise</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">{balance.partner1.name} ha pagato</p>
                <p className="text-xl font-bold">{formatCurrency(balance.sharedBalance.partner1Paid)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">{balance.partner2.name} ha pagato</p>
                <p className="text-xl font-bold">{formatCurrency(balance.sharedBalance.partner2Paid)}</p>
              </div>
            </div>
            <div className="pt-3 border-t">
              <p className="text-sm text-gray-600">Totale spese condivise</p>
              <p className="text-2xl font-bold">{formatCurrency(balance.sharedBalance.totalSharedExpenses)}</p>
            </div>
            {balance.sharedBalance.amount > 0 && (
              <div className="mt-4 p-4 bg-white rounded-lg border-2 border-orange-300">
                <p className="text-lg font-semibold text-orange-700">
                  {balance.sharedBalance.whoOwes}
                </p>
                <p className="text-2xl font-bold text-orange-600 mt-1">
                  {formatCurrency(balance.sharedBalance.amount)}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Schede individuali */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Partner 1 */}
        <Card>
          <CardHeader>
            <CardTitle>{balance.partner1.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Entrate:</span>
                <span className="font-semibold text-green-600">
                  {formatCurrency(balance.partner1.totalIncome)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Spese personali:</span>
                <span className="font-semibold text-red-600">
                  -{formatCurrency(balance.partner1.totalPersonalExpenses)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Spese condivise (50%):</span>
                <span className="font-semibold text-red-600">
                  -{formatCurrency(balance.partner1.totalSharedExpenses)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Investimenti:</span>
                <span className="font-semibold text-blue-600">
                  -{formatCurrency(balance.partner1.totalInvestments)}
                </span>
              </div>
              <div className="pt-2 border-t flex justify-between">
                <span className="font-bold text-gray-800">Saldo:</span>
                <span className={`text-xl font-bold ${balance.partner1.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(balance.partner1.balance)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Partner 2 */}
        <Card>
          <CardHeader>
            <CardTitle>{balance.partner2.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Entrate:</span>
                <span className="font-semibold text-green-600">
                  {formatCurrency(balance.partner2.totalIncome)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Spese personali:</span>
                <span className="font-semibold text-red-600">
                  -{formatCurrency(balance.partner2.totalPersonalExpenses)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Spese condivise (50%):</span>
                <span className="font-semibold text-red-600">
                  -{formatCurrency(balance.partner2.totalSharedExpenses)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Investimenti:</span>
                <span className="font-semibold text-blue-600">
                  -{formatCurrency(balance.partner2.totalInvestments)}
                </span>
              </div>
              <div className="pt-2 border-t flex justify-between">
                <span className="font-bold text-gray-800">Saldo:</span>
                <span className={`text-xl font-bold ${balance.partner2.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(balance.partner2.balance)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
