'use server';

import clientPromise from "@/libs/mongodb";
import { ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";


async function getCollection(collectionName: string) {
  const client = await clientPromise;
  const db = client.db('travel');
  return db.collection(collectionName);
}

const FolderFormSchema = z.object({
  id: z.string(),
  name: z.string({
    invalid_type_error: '폴더 이름의 형식이 잘못되었습니다',
  }).min(1, '폴더 이름을 1글자 이상 입력해주세요'),
  creator: z.string(),
});


const CreateFolder = FolderFormSchema.omit({
  id: true,
  creator: true,
});

const UpdateFolder = FolderFormSchema.omit({
  id: true,
  creator: true,
});

export interface State{
  error?:{
    name?: string[];
  };
  message?: string | null;
};

export async function createFolder(prevState:State, formData: FormData){
  try {
    const validatedFields = CreateFolder.safeParse({
      name: formData.get('name'),
    });
  
    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        message: '모든 필드를 입력해주세요.',
      };
    }
    const {name} = validatedFields.data;
    const test = 'test1@naver.com';

    const folderCollection = await getCollection('folders');
    await folderCollection.insertOne({
      name: name,
      creator: test,
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
    const projectsCollection = await getCollection('projects');
    await folderCollection.deleteOne({ _id: new ObjectId(folderId) });
    await projectsCollection.updateMany(
      { folderId: new ObjectId(folderId) },
      { $unset: { folderId: "" } }
    );
    revalidatePath('/project');
    return { message: 'Deleted Folder' };
  } catch (error) {
    return { message: 'Database Error: Failed to Delete Folder.' };
  }
}

export async function updateFolder(folderId:string, prevState:State, formData: FormData){
  try {
    const validatedFields = UpdateFolder.safeParse({
      name: formData.get('name'),
    });
  
    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        message: 'Missing Fields. Failed to Create Article.',
      };
    }
    const {name} = validatedFields.data;

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
