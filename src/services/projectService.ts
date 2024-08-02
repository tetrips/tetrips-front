import { ObjectId } from "mongodb";
import clientPromise from '@/libs/mongodb';
import { ClientProject, Project } from '@/types/Project';
import { unstable_noStore } from "next/cache";

async function getCollection(collectionName: string) {
  const client = await clientPromise;
  const db = client.db('travel');
  return db.collection(collectionName);
}

export async function  fetchProjectsByUserId(username:string):Promise<ClientProject[]|null> {
  unstable_noStore();
  try {
    const projectCollection = await getCollection('projects');
    const data = await projectCollection.find({ creator: username }).toArray();
    if (!data){
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
    })) as ClientProject[];
    return projects;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch places.');
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



