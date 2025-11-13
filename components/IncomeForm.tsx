'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { Input, Select } from './ui/Input';
import { Partner } from '@/lib/types';

interface IncomeFormProps {
  partners: Partner[];
  onAdd: () => void;
}

export function IncomeForm({ partners, onAdd }: IncomeFormProps) {
  const [partnerId, setPartnerId] = useState(partners[0]?.id || 1);
  const [amount, setAmount] = useState('2500');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('Stipendio mensile');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch('/api/income', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        partner_id: partnerId,
        amount: parseFloat(amount),
        date,
        description,
      }),
    });

    if (response.ok) {
      setAmount('2500');
      setDescription('Stipendio mensile');
      setDate(new Date().toISOString().split('T')[0]);
      onAdd();
    }
  };

  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 p-6">
        <h2 className="text-2xl font-bold text-white">💰 Aggiungi Entrata</h2>
      </div>
      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <Select
            label="Partner"
            options={partners.map(p => ({ value: p.id, label: p.name }))}
            value={partnerId}
            onChange={(e) => setPartnerId(Number(e.target.value))}
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

          <Input
            label="Descrizione"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <Button type="submit" variant="success" size="lg" className="w-full mt-6">
            ✅ Aggiungi Entrata
          </Button>
        </form>
      </div>
    </div>
  );
}
