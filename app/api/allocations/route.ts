import { NextResponse } from 'next/server';
import db from '@/lib/database';

export async function GET() {
  try {
    const allocations = db.prepare('SELECT * FROM investment_allocations ORDER BY percentage DESC').all();
    return NextResponse.json(allocations);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch allocations' }, { status: 500 });
  }
}
