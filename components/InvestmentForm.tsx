'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { Input, Select } from './ui/Input';
import { Partner, InvestmentAllocation } from '@/lib/types';

interface InvestmentFormProps {
  partners: Partner[];
  allocations: InvestmentAllocation[];
  onAdd: () => void;
}

export function InvestmentForm({ partners, allocations, onAdd }: InvestmentFormProps) {
  const [partnerId, setPartnerId] = useState(partners[0]?.id || 1);
  const [amount, setAmount] = useState('350');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [allocId, setAllocId] = useState(allocations[0]?.id || 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const selectedAlloc = allocations.find(a => a.id === allocId);
    if (!selectedAlloc) return;

    const response = await fetch('/api/investments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        partner_id: partnerId,
        amount: parseFloat(amount),
        date,
        type: selectedAlloc.type,
        symbol: selectedAlloc.symbol,
        description: selectedAlloc.name,
      }),
    });

    if (response.ok) {
      setAmount('350');
      setDate(new Date().toISOString().split('T')[0]);
      onAdd();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Aggiungi Investimento</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
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

          <Select
            label="Tipo di Investimento"
            options={allocations.map(a => ({
              value: a.id!,
              label: `${a.name} (${a.percentage}%)`,
            }))}
            value={allocId}
            onChange={(e) => setAllocId(Number(e.target.value))}
          />

          <Button type="submit" className="w-full">
            Aggiungi Investimento
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
