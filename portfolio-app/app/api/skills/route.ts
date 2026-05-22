import { NextResponse } from 'next/server';
import { readData, writeData } from '@/lib/data';
import type { SkillCategory } from '@/types';

export async function GET() {
  try {
    const skills = readData<SkillCategory[]>('skills.json');
    return NextResponse.json({ success: true, data: skills });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to read skills' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    writeData('skills.json', body);
    return NextResponse.json({ success: true, data: body });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to update skills' },
      { status: 500 }
    );
  }
}
