import { NextResponse } from 'next/server';
import db from '@/lib/database';

export async function GET() {
  try {
    const partners = db.prepare('SELECT * FROM partners ORDER BY id').all();
    return NextResponse.json(partners);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch partners' }, { status: 500 });
  }
}
