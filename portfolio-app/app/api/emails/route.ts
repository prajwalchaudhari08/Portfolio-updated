import { NextResponse } from 'next/server';
import { readData, deleteItem } from '@/lib/data';
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

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Email ID is required' },
        { status: 400 }
      );
    }
    const deleted = deleteItem<EmailLog>('emails.json', id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Email log not found' },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, message: 'Email log deleted successfully' });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to delete email log' },
      { status: 500 }
    );
  }
}
