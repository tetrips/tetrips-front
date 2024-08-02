import clientPromise from "@/libs/mongodb";
import { ClientProject, Project } from "@/types/Project";
import { ObjectId } from "mongodb";
import { revalidatePath, unstable_noStore } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest, { params }: { params: { projectId: string } }) {
  unstable_noStore();
  const client = await clientPromise;
  const db = client.db('travel');
  const projectCollection = await db.collection('projects');
  try {
    const data:ClientProject = await request.json();
    const projectId = params.projectId;
    console.log('projectId:', projectId);
    console.log('data:', data);
    const transformedData: Project = {
      _id: new ObjectId(projectId),
      creator: data.creator,
      title: data.title,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      createdAt: new Date(data.createdAt),
      guests: data.guests,
      itineraries: data.itineraries,
    };

    for (const itinerary of transformedData.itineraries) {
      await projectCollection.updateOne(
        { 
          _id: new ObjectId(projectId),
          "itineraries.id": itinerary.id
        },
        { 
          $set: {
            "itineraries.$.date": itinerary.date,
            "itineraries.$.dayStartTime": itinerary.dayStartTime,
            "itineraries.$.startPlace": itinerary.startPlace || null,
            "itineraries.$.endPlace": itinerary.endPlace || null,
            "itineraries.$.destinations": itinerary.destinations || []
          }
        }
      );
    }
    
    const updatedProject = await projectCollection.findOne({ _id: new ObjectId(projectId) });
    if (!updatedProject) {
      return NextResponse.json({ status: 'ERROR', error: '프로젝트 수정 중 오류가 발생했습니다.' }, { status: 500 })};

    const updatedData = {
      id: updatedProject._id.toString(),
      title: updatedProject.title,
      creator: updatedProject.creator,
      startDate: updatedProject.startDate.toISOString().split('T')[0],
      endDate: updatedProject.endDate.toISOString().split('T')[0],
      createdAt: updatedProject.createdAt.toISOString().split('T')[0],
      guests: updatedProject.guests,
      itineraries: updatedProject.itineraries,
    } as ClientProject;
    console.log('updatedData:', updatedData);
    
    revalidatePath(`/project/${projectId}`);

    return NextResponse.json({ status: 'OK', message: 'Project updated successfully', project: updatedData }, { status: 200 });

  } catch (error) {
    console.error('Project update error:', error);
    return NextResponse.json({ status: 'ERROR', error: '프로젝트 수정 중 오류가 발생했습니다.' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { projectId: string } }) {
  const client = await clientPromise;
  const db = client.db('travel');
  const projectCollection = db.collection('projects');
  try {
    const projectId = params.projectId;
    const result = await projectCollection.deleteOne({ _id: new ObjectId(projectId) });
    if (result.deletedCount === 0) {
      return NextResponse.json({ message: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Deleted Project' });
  } catch (error) {
    console.error('Database Error:', error);
    return NextResponse.json({ message: 'Database Error: Failed to Delete Project.' }, { status: 500 });
  }
}