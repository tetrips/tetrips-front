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

const ArticleFormSchema = z.object({
  id: z.string(),
  author: z.string(),
  title: z.string({
    invalid_type_error: '제목의 형식이 잘못되었습니다',
  }).min(1, '제목을 1글자 이상 입력해주세요'),
  content: z.string({
    invalid_type_error: '내용의 형식이 잘못되었습니다',
  }).min(1, '내용을 1글자 이상 입력해주세요'),
  createdAt: z.string(),
});


const CreateArticle = ArticleFormSchema.omit({
  id: true,
  author: true,
  createdAt: true,
});

const UpdateArticle = ArticleFormSchema.omit({
  id: true,
  author: true,
  createdAt: true,
});

export interface State{
  error?:{
    title?: string[];
    content?: string[];
  };
  message?: string | null;
};

export async function createArticle(prevState:State, formData: FormData){
  try {

    const validatedFields = CreateArticle.safeParse({
      title: formData.get('title'),
      content: formData.get('content'),
    });
  
    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        message: '모든 필드를 입력해주세요.',
      };
    }
    const { title, content} = validatedFields.data;
    const author = 'test1@naver.com';
    const createdAt = new Date();

    const articleCollection = await getCollection('articles');
    await articleCollection.insertOne({
      author,
      title,
      content,
      createdAt,
    });

  } catch (error) {
    return { message: 'Database Error: Failed to Create Project.' };
  }
  revalidatePath('/articles');
  redirect('/articles');
}


export async function deleteArticle(articleId: string) {
  try {
    const collection = await getCollection('articles');
    await collection.deleteOne({ _id: new ObjectId(articleId) });
    revalidatePath('/articles');
    return { message: 'Deleted Article' };
  } catch (error) {
    return { message: 'Database Error: Failed to Delete Article.' };
  }
}

export async function updateArticle(id:string, prevState:State, formData: FormData){
  try {
    const validatedFields = UpdateArticle.safeParse({
      title: formData.get('title'),
      content: formData.get('content'),
    });
  
    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        message: 'Missing Fields. Failed to Create Article.',
      };
    }
    const { title, content} = validatedFields.data;


    const articleCollection = await getCollection('articles');
    await articleCollection.updateOne({
      _id: new ObjectId(id)
    }, {
      $set: {
        title,
        content,
      }
    });

  } catch (error) {
    return { message: 'Database Error: Failed to Create Project.' };
  }
  revalidatePath('/articles');
  redirect('/articles');

}
