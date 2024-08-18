import clientPromise from '@/libs/mongodb';
import { unstable_noStore } from "next/cache";
import { ClientFolder } from "@/types/Folder";

async function getCollection(collectionName: string) {
  const client = await clientPromise;
  const db = client.db('travel');
  return db.collection(collectionName);
}

export async function fetchFoldersByUserId(username: string): Promise<ClientFolder[] | null> {
  unstable_noStore();
  try {
    const folderCollection = await getCollection('folders');
    const data = await folderCollection.find({
      creator: username,
    }).toArray();

    if (!data || data.length === 0) {
      return null;
    }
    const folders = data.map((folder) => ({
      id: folder._id.toString(),
      name: folder.name,
      creator: folder.creator,
      projectIds: folder.projectIds,
    })) as ClientFolder[] | null;

    return folders;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch folders.');
  }
}

