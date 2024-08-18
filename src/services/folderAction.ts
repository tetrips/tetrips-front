'use server';
import clientPromise from "@/libs/mongodb";
import { ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

async function getCollection(collectionName: string) {
  const client = await clientPromise;
  const db = client.db('travel');
  return db.collection(collectionName);
}

export async function createFolder(name: string) {
  const usernameData = cookies().get('username');
  if (!usernameData) {
    redirect('/login');
  }
  const username = usernameData.value;
  try {
    const projectIds:string[] = [];

    const folderCollection = await getCollection('folders');
    await folderCollection.insertOne({
      name: name,
      creator: username,
      projectIds: projectIds,
    });

  } catch (error) {
    return { message: 'Database Error: Failed to Create Folder.' };
  }
  revalidatePath('/project');
  redirect('/project');
}


export async function deleteFolder(folderId: string) {
  try {
    const folderCollection = await getCollection('folders');
    await folderCollection.deleteOne({ _id: new ObjectId(folderId) });
    revalidatePath('/project');
    return { message: 'Deleted Folder' };
  } catch (error) {
    return { message: 'Database Error: Failed to Delete Folder.' };
  }
}

export async function updateFolder(folderId:string, name: string) {
  try {
    const folderCollection = await getCollection('folders');
    await folderCollection.updateOne({
      _id: new ObjectId(folderId)
    }, {
      $set: {
        name: name,
      }
    });

  } catch (error) {
    return { message: 'Database Error: Failed to Update Folder.' };
  }
  revalidatePath('/project');
  redirect('/project');

}
export async function addProjectToFolder(folderId: string, projectId: string) {
  try {
    const folderCollection = await getCollection('folders');
    await folderCollection.updateOne(
      { _id: new ObjectId(folderId) },
      { $addToSet: { projectIds: projectId } }
    );
  } catch (error) {
    return { message: 'Database Error: Failed to Add Project to Folder.' };
  }
  revalidatePath('/project');
  redirect('/project');
}

export async function removeProjectFromFolder(folderId: string, projectId: string) {
  try {
    const folderCollection = await getCollection('folders');
    await folderCollection.updateOne(
      { _id: new ObjectId(folderId) },
      { $pull: { projectIds: projectId } }
    );
  } catch (error) {
    return { message: 'Database Error: Failed to Remove Project from Folder.' };
  }
  revalidatePath('/project');
}
