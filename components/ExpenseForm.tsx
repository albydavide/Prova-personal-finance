'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { Input, Select } from './ui/Input';
import { Partner } from '@/lib/types';

interface ExpenseFormProps {
  partners: Partner[];
  onAdd: () => void;
}

const categories = [
  'Alimentari',
  'Affitto',
  'Bollette',
  'Trasporti',
  'Salute',
  'Intrattenimento',
  'Shopping',
  'Altro',
];

export function ExpenseForm({ partners, onAdd }: ExpenseFormProps) {
  const [partnerId, setPartnerId] = useState(partners[0]?.id || 1);
  const [paidBy, setPaidBy] = useState(partners[0]?.id || 1);
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState(categories[0]);
  const [description, setDescription] = useState('');
  const [isShared, setIsShared] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch('/api/expenses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        partner_id: partnerId,
        paid_by: paidBy,
        amount: parseFloat(amount),
        date,
        category,
        description,
        is_shared: isShared,
      }),
    });

    if (response.ok) {
      setAmount('');
      setDescription('');
      setDate(new Date().toISOString().split('T')[0]);
      setIsShared(false);
      onAdd();
    }
  };

  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-red-600 to-red-700 p-6">
        <h2 className="text-2xl font-bold text-white">💸 Aggiungi Spesa</h2>
      </div>
      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <Select
            label="Partner"
            options={partners.map(p => ({ value: p.id, label: p.name }))}
            value={partnerId}
            onChange={(e) => setPartnerId(Number(e.target.value))}
          />

          <Select
            label="Pagato da"
            options={partners.map(p => ({ value: p.id, label: p.name }))}
            value={paidBy}
            onChange={(e) => setPaidBy(Number(e.target.value))}
          />

          <Input
            label="Importo (€)"
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />

          <Input
            label="Data"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />

          <Select
            label="Categoria"
            options={categories.map(c => ({ value: c, label: c }))}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />

          <Input
            label="Descrizione"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="bg-gradient-to-r from-slate-50 to-gray-100 p-4 rounded-2xl border-2 border-slate-200">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isShared}
                onChange={(e) => setIsShared(e.target.checked)}
                className="w-5 h-5 rounded border-gray-300 text-slate-600 focus:ring-slate-500 cursor-pointer"
              />
              <span className="ml-3 text-sm font-semibold text-gray-800">
                🤝 Spesa condivisa (50/50)
              </span>
            </label>
          </div>

          <Button type="submit" variant="danger" size="lg" className="w-full mt-6">
            ➕ Aggiungi Spesa
          </Button>
        </form>
      </div>
    </div>
  );
}
