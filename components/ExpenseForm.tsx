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
    <Card>
      <CardHeader>
        <CardTitle>Aggiungi Spesa</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
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

          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={isShared}
                onChange={(e) => setIsShared(e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm font-medium text-gray-700">
                Spesa condivisa (50/50)
              </span>
            </label>
          </div>

          <Button type="submit" className="w-full">
            Aggiungi Spesa
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
