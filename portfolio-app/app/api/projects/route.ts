import { NextResponse } from 'next/server';
import { readData, addItem } from '@/lib/data';
import type { Project } from '@/types';
import { v4 as uuidv4 } from 'uuid';

export async function GET() {
  try {
    const projects = readData<Project[]>('projects.json');
    return NextResponse.json({ success: true, data: projects });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to read projects' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newProject: Project = {
      id: uuidv4(),
      title: body.title || '',
      description: body.description || '',
      techStack: body.techStack || [],
      image: body.image || '',
      githubUrl: body.githubUrl || '',
      liveUrl: body.liveUrl || '',
      featured: body.featured || false,
    };
    addItem('projects.json', newProject);
    return NextResponse.json({ success: true, data: newProject }, { status: 201 });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to create project' },
      { status: 500 }
    );
  }
}
