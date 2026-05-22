import { NextResponse } from 'next/server';
import { readData, writeData } from '@/lib/data';
import type { Profile } from '@/types';

export async function GET() {
  try {
    const profile = readData<Profile>('profile.json');
    return NextResponse.json({ success: true, data: profile });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to read profile' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const updates = await request.json();
    const profile = readData<Profile>('profile.json');
    const updated = { ...profile, ...updates };
    writeData('profile.json', updated);
    return NextResponse.json({ success: true, data: updated });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}
