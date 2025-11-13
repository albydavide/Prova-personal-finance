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
      <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-gray-200 overflow-hidden hover:shadow-2xl transition-all duration-300">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6">
          <h2 className="text-2xl font-bold text-white">📊 Diversificazione Investimenti</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}%`}
                    outerRadius={100}
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

            <div className="space-y-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-5 rounded-2xl border-2 border-blue-200 hover:scale-105 transition-all duration-300">
                <p className="text-sm text-blue-800 font-medium mb-2">Investimento mensile per partner</p>
                <p className="text-3xl font-bold text-blue-700">{formatCurrency(monthlyInvestment)}</p>
              </div>
              <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-5 rounded-2xl border-2 border-slate-200 hover:scale-105 transition-all duration-300">
                <p className="text-sm text-slate-800 font-medium mb-2">Investimento mensile totale</p>
                <p className="text-3xl font-bold text-slate-700">{formatCurrency(monthlyInvestment * 2)}</p>
              </div>
              <div className="bg-gradient-to-br from-gray-50 to-slate-100 p-5 rounded-2xl border-2 border-slate-200">
                <p className="text-sm text-slate-800 font-medium mb-3">Allocazione mensile:</p>
                <div className="space-y-2">
                  {allocations.map(alloc => (
                    <div key={alloc.id} className="flex justify-between items-center p-2 hover:bg-white/50 rounded-lg transition-colors">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded-full shadow-lg"
                          style={{ backgroundColor: alloc.color }}
                        />
                        <span className="text-sm font-medium text-gray-700">{alloc.name}</span>
                      </div>
                      <span className="font-bold text-slate-700">
                        {formatCurrency((monthlyInvestment * alloc.percentage) / 100)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dati di mercato */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {allocations.map(alloc => {
          const market = marketData[alloc.symbol || ''];
          return (
            <div key={alloc.id} className="group bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200 p-5 hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-between mb-3">
                <div
                  className="w-5 h-5 rounded-full shadow-lg"
                  style={{ backgroundColor: alloc.color }}
                />
                <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-2 py-1 rounded-full">{alloc.symbol}</span>
              </div>
              <h4 className="font-bold text-base mb-1 text-gray-800">{alloc.name}</h4>
              <p className="text-xs text-gray-600 mb-3 font-medium">{alloc.type}</p>
              {market && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-2xl font-bold text-gray-900">
                    ${market.price.toFixed(2)}
                  </p>
                  <div className={`inline-flex items-center mt-1 px-2 py-1 rounded-full text-sm font-bold ${market.changePercent >= 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                    {market.changePercent >= 0 ? '↑' : '↓'} {Math.abs(market.changePercent).toFixed(2)}%
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
