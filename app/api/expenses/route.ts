import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/database';
import { Expense } from '@/lib/types';

export async function GET() {
  try {
    const expenses = db.prepare(`
      SELECT e.*, p.name as partner_name, p.color as partner_color,
             pb.name as paid_by_name
      FROM expenses e
      JOIN partners p ON e.partner_id = p.id
      JOIN partners pb ON e.paid_by = pb.id
      ORDER BY e.date DESC
    `).all();

    return NextResponse.json(expenses);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch expenses' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: Expense = await request.json();

    const result = db.prepare(`
      INSERT INTO expenses (partner_id, amount, date, category, description, is_shared, paid_by)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      body.partner_id,
      body.amount,
      body.date,
      body.category,
      body.description || '',
      body.is_shared ? 1 : 0,
      body.paid_by
    );

    return NextResponse.json({ id: result.lastInsertRowid, ...body });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add expense' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }

    db.prepare('DELETE FROM expenses WHERE id = ?').run(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete expense' }, { status: 500 });
  }
}
