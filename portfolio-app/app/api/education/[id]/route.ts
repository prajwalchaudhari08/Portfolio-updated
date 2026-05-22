import { NextResponse } from 'next/server';
import { updateItem, deleteItem } from '@/lib/data';
import type { Education } from '@/types';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const updates = await request.json();
    const updated = updateItem<Education>('education.json', id, updates);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'Education not found' },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: updated });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to update education' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deleted = deleteItem<Education>('education.json', id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Education not found' },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, message: 'Education deleted' });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to delete education' },
      { status: 500 }
    );
  }
}
