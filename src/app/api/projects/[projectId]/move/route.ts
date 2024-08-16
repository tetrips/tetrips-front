import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import clientPromise from '@/libs/mongodb';
import { revalidatePath } from 'next/cache';

export async function PUT(request: Request, { params }: { params: { projectId: string } }) {
  const username = 'test1@naver.com';

  if (!username) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { folderId } = await request.json();
    const projectId = params.projectId;
    const client = await clientPromise;
    const db = client.db('travel');
    const projectsCollection = db.collection('projects');

    const updateData = folderId
      ? { $set: { folderId: new ObjectId(folderId) } }
      : { $unset: { folderId: "" } };

    const result = await projectsCollection.findOneAndUpdate(
      { 
        _id: new ObjectId(projectId),
        $or: [{ creator: username }, { 'guests.email': username }]
      },
      updateData,
      { returnDocument: 'after' }
    );

    if (!result.value) {
      return NextResponse.json({ error: 'Project not found or unauthorized' }, { status: 404 });
    }
    revalidatePath('/project')

    return NextResponse.json(result.value);
  } catch (error) {
    console.error('Error moving project:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}