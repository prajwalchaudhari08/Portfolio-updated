import { NextResponse } from 'next/server';
import { readData, addItem } from '@/lib/data';
import type { Experience } from '@/types';
import { v4 as uuidv4 } from 'uuid';

export async function GET() {
  try {
    const experience = readData<Experience[]>('experience.json');
    return NextResponse.json({ success: true, data: experience });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to read experience' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newExp: Experience = {
      id: uuidv4(),
      role: body.role || '',
      company: body.company || '',
      location: body.location || '',
      period: body.period || '',
      achievements: body.achievements || [],
    };
    addItem('experience.json', newExp);
    return NextResponse.json({ success: true, data: newExp }, { status: 201 });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to create experience' },
      { status: 500 }
    );
  }
}
