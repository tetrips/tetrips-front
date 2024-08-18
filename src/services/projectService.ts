import { ObjectId } from "mongodb";
import clientPromise from '@/libs/mongodb';
import { ClientProject, Guest, Project } from '@/types/Project';
import { revalidatePath, unstable_noStore } from "next/cache";

async function getCollection(collectionName: string) {
  const client = await clientPromise;
  const db = client.db('travel');
  return db.collection(collectionName);
}

export async function fetchProjectsByUserId(username: string): Promise<ClientProject[] | null> {
  unstable_noStore();
  try {
    const projectCollection = await getCollection('projects');
    const data = await projectCollection.find({
      $or: [
        { creator: username },
        { guests: { $elemMatch: { email: username } } }
      ]
    }).toArray();

    if (!data || data.length === 0) {
      return null;
    }

    const projects = data.map((project) => ({
      id: project._id.toString(),
      title: project.title,
      creator: project.creator,
      startDate: project.startDate.toISOString().split('T')[0],
      endDate: project.endDate.toISOString().split('T')[0],
      createdAt: project.createdAt.toISOString().split('T')[0],
      guests: project.guests,
      itineraries: project.itineraries,
    })) as ClientProject[] | null;

    return projects;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch projects.');
  }
}


export async function fetchProjectById(projectId:string):Promise<ClientProject> {
  unstable_noStore();
  try{
    const projectCollection = await getCollection('projects');
    const project = await projectCollection.findOne({_id: new ObjectId(projectId)}) as Project | null;
    if (!project) throw new Error('Projects not found.');
    
    return {
      id: project._id.toString(),
      title: project.title,
      creator: project.creator,
      startDate: project.startDate.toISOString().split('T')[0],
      endDate: project.endDate.toISOString().split('T')[0],
      createdAt: project.createdAt.toISOString().split('T')[0],
      guests: project.guests,
      itineraries: project.itineraries,
    }as ClientProject;
  }catch(error){
    console.error('Database Error:', error);
    throw new Error('Failed to fetch user data.');
  }
}

export async function inviteGuest(projectId: string, email: string, nickname: string) {
  if (!ObjectId.isValid(projectId)) {
    throw new Error('유효하지 않은 프로젝트 ID입니다.');
  }
  try {
    const projectCollection = await getCollection('projects');
    const guest: Guest = { email, nickname };

    const result = await projectCollection.updateOne(
      { _id: new ObjectId(projectId), 'guests.email': { $ne: email } },
      { $addToSet: { guests: guest } }
    );
    revalidatePath(`/project/${projectId}`);
  } catch (error) {
    console.error('초대 처리 중 오류 발생:', error);
    throw error; 
  }
}



