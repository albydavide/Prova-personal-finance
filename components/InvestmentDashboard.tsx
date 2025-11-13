'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { InvestmentAllocation, MarketData } from '@/lib/types';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface InvestmentDashboardProps {
  allocations: InvestmentAllocation[];
  monthlyInvestment: number;
}

export function InvestmentDashboard({ allocations, monthlyInvestment }: InvestmentDashboardProps) {
  const [marketData, setMarketData] = useState<{ [key: string]: MarketData }>({});

  useEffect(() => {
    // Carica dati di mercato per ogni simbolo
    allocations.forEach(async (alloc) => {
      if (alloc.symbol) {
        const response = await fetch(`/api/market?symbol=${alloc.symbol}`);
        const data = await response.json();
        setMarketData(prev => ({ ...prev, [alloc.symbol!]: data }));
      }
    });
  }, [allocations]);

  const chartData = allocations.map(alloc => ({
    name: alloc.name,
    value: alloc.percentage,
    color: alloc.color,
  }));

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Diversificazione Investimenti</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Investimento mensile per partner</p>
                <p className="text-3xl font-bold text-blue-600">{formatCurrency(monthlyInvestment)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Investimento mensile totale</p>
                <p className="text-2xl font-bold text-purple-600">{formatCurrency(monthlyInvestment * 2)}</p>
              </div>
              <div className="pt-3 border-t">
                <p className="text-sm text-gray-600 mb-2">Allocazione mensile:</p>
                <div className="space-y-2">
                  {allocations.map(alloc => (
                    <div key={alloc.id} className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: alloc.color }}
                        />
                        <span className="text-sm">{alloc.name}</span>
                      </div>
                      <span className="font-semibold">
                        {formatCurrency((monthlyInvestment * alloc.percentage) / 100)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dati di mercato */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {allocations.map(alloc => {
          const market = marketData[alloc.symbol || ''];
          return (
            <Card key={alloc.id}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: alloc.color }}
                  />
                  <span className="text-xs text-gray-500">{alloc.symbol}</span>
                </div>
                <h4 className="font-semibold text-sm mb-1">{alloc.name}</h4>
                <p className="text-xs text-gray-600 mb-2">{alloc.type}</p>
                {market && (
                  <div>
                    <p className="text-2xl font-bold">
                      ${market.price.toFixed(2)}
                    </p>
                    <p className={`text-sm ${market.changePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {market.changePercent >= 0 ? '+' : ''}{market.changePercent.toFixed(2)}%
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
