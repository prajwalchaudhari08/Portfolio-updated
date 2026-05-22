import { NextResponse } from 'next/server';
import { readData, addItem } from '@/lib/data';
import type { Education } from '@/types';
import { v4 as uuidv4 } from 'uuid';

export async function GET() {
  try {
    const education = readData<Education[]>('education.json');
    return NextResponse.json({ success: true, data: education });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to read education' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newEdu: Education = {
      id: uuidv4(),
      degree: body.degree || '',
      institution: body.institution || '',
      location: body.location || '',
      period: body.period || '',
      score: body.score || '',
      status: body.status || 'Completed',
      description: body.description || '',
    };
    addItem('education.json', newEdu);
    return NextResponse.json({ success: true, data: newEdu }, { status: 201 });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to create education' },
      { status: 500 }
    );
  }
}
