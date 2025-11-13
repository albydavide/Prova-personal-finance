import { NextResponse } from 'next/server';
import db from '@/lib/database';
import { BalanceData } from '@/lib/types';

export async function GET() {
  try {
    // Ottieni i partner
    const partners = db.prepare('SELECT * FROM partners ORDER BY id').all() as any[];

    if (partners.length < 2) {
      return NextResponse.json({ error: 'Need 2 partners' }, { status: 400 });
    }

    const partner1 = partners[0];
    const partner2 = partners[1];

    // Calcola totali per partner 1
    const p1Income = db.prepare('SELECT COALESCE(SUM(amount), 0) as total FROM income WHERE partner_id = ?').get(partner1.id) as any;
    const p1PersonalExpenses = db.prepare('SELECT COALESCE(SUM(amount), 0) as total FROM expenses WHERE partner_id = ? AND is_shared = 0').get(partner1.id) as any;
    const p1SharedExpenses = db.prepare('SELECT COALESCE(SUM(amount), 0) as total FROM expenses WHERE partner_id = ? AND is_shared = 1').get(partner1.id) as any;
    const p1Investments = db.prepare('SELECT COALESCE(SUM(amount), 0) as total FROM investments WHERE partner_id = ?').get(partner1.id) as any;

    // Calcola totali per partner 2
    const p2Income = db.prepare('SELECT COALESCE(SUM(amount), 0) as total FROM income WHERE partner_id = ?').get(partner2.id) as any;
    const p2PersonalExpenses = db.prepare('SELECT COALESCE(SUM(amount), 0) as total FROM expenses WHERE partner_id = ? AND is_shared = 0').get(partner2.id) as any;
    const p2SharedExpenses = db.prepare('SELECT COALESCE(SUM(amount), 0) as total FROM expenses WHERE partner_id = ? AND is_shared = 1').get(partner2.id) as any;
    const p2Investments = db.prepare('SELECT COALESCE(SUM(amount), 0) as total FROM investments WHERE partner_id = ?').get(partner2.id) as any;

    // Calcola quanto ha pagato ciascuno per le spese condivise
    const p1SharedPaid = db.prepare('SELECT COALESCE(SUM(amount), 0) as total FROM expenses WHERE is_shared = 1 AND paid_by = ?').get(partner1.id) as any;
    const p2SharedPaid = db.prepare('SELECT COALESCE(SUM(amount), 0) as total FROM expenses WHERE is_shared = 1 AND paid_by = ?').get(partner2.id) as any;

    // Totale spese condivise
    const totalSharedExpenses = p1SharedExpenses.total + p2SharedExpenses.total;

    // Con split 50/50, ciascuno dovrebbe pagare metà
    const shouldPayEach = totalSharedExpenses / 2;

    // Calcola chi deve a chi
    const p1Difference = p1SharedPaid.total - shouldPayEach;
    const p2Difference = p2SharedPaid.total - shouldPayEach;

    let whoOwes = 'nessuno';
    let amount = 0;

    if (p1Difference > 0) {
      whoOwes = `${partner2.name} deve dare a ${partner1.name}`;
      amount = Math.abs(p1Difference);
    } else if (p2Difference > 0) {
      whoOwes = `${partner1.name} deve dare a ${partner2.name}`;
      amount = Math.abs(p2Difference);
    }

    // Calcola balance per ciascun partner
    const p1Balance = p1Income.total - p1PersonalExpenses.total - shouldPayEach - p1Investments.total;
    const p2Balance = p2Income.total - p2PersonalExpenses.total - shouldPayEach - p2Investments.total;

    // Totali di coppia
    const totalIncome = p1Income.total + p2Income.total;
    const totalExpenses = p1PersonalExpenses.total + p2PersonalExpenses.total + totalSharedExpenses;
    const totalInvestments = p1Investments.total + p2Investments.total;
    const coupleBalance = totalIncome - totalExpenses - totalInvestments;

    const balanceData: BalanceData = {
      partner1: {
        id: partner1.id,
        name: partner1.name,
        totalIncome: p1Income.total,
        totalPersonalExpenses: p1PersonalExpenses.total,
        totalSharedExpenses: shouldPayEach,
        totalInvestments: p1Investments.total,
        balance: p1Balance,
      },
      partner2: {
        id: partner2.id,
        name: partner2.name,
        totalIncome: p2Income.total,
        totalPersonalExpenses: p2PersonalExpenses.total,
        totalSharedExpenses: shouldPayEach,
        totalInvestments: p2Investments.total,
        balance: p2Balance,
      },
      sharedBalance: {
        totalSharedExpenses,
        partner1Paid: p1SharedPaid.total,
        partner2Paid: p2SharedPaid.total,
        whoOwes,
        amount,
      },
      couple: {
        totalIncome,
        totalExpenses,
        totalInvestments,
        balance: coupleBalance,
      },
    };

    return NextResponse.json(balanceData);
  } catch (error) {
    console.error('Balance calculation error:', error);
    return NextResponse.json({ error: 'Failed to calculate balance' }, { status: 500 });
  }
}
