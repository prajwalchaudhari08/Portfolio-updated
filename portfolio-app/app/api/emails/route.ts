import { NextResponse } from 'next/server';
import { readData } from '@/lib/data';
import type { EmailLog } from '@/types';

export async function GET() {
  try {
    const emails = readData<EmailLog[]>('emails.json');
    return NextResponse.json({ success: true, data: emails });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to read email logs' },
      { status: 500 }
    );
  }
}
