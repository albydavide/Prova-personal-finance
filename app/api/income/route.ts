import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/database';
import { Income } from '@/lib/types';

export async function GET() {
  try {
    const income = db.prepare(`
      SELECT i.*, p.name as partner_name, p.color as partner_color
      FROM income i
      JOIN partners p ON i.partner_id = p.id
      ORDER BY i.date DESC
    `).all();

    return NextResponse.json(income);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch income' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: Income = await request.json();

    const result = db.prepare(`
      INSERT INTO income (partner_id, amount, date, description)
      VALUES (?, ?, ?, ?)
    `).run(body.partner_id, body.amount, body.date, body.description || '');

    return NextResponse.json({ id: result.lastInsertRowid, ...body });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add income' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }

    db.prepare('DELETE FROM income WHERE id = ?').run(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete income' }, { status: 500 });
  }
}
