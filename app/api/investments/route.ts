import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/database';
import { Investment } from '@/lib/types';

export async function GET() {
  try {
    const investments = db.prepare(`
      SELECT i.*, p.name as partner_name, p.color as partner_color
      FROM investments i
      JOIN partners p ON i.partner_id = p.id
      ORDER BY i.date DESC
    `).all();

    return NextResponse.json(investments);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch investments' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: Investment = await request.json();

    const result = db.prepare(`
      INSERT INTO investments (partner_id, amount, date, type, symbol, description)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      body.partner_id,
      body.amount,
      body.date,
      body.type,
      body.symbol || '',
      body.description || ''
    );

    return NextResponse.json({ id: result.lastInsertRowid, ...body });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add investment' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }

    db.prepare('DELETE FROM investments WHERE id = ?').run(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete investment' }, { status: 500 });
  }
}
