import { unstable_noStore as noStore } from 'next/cache';
import clientPromise from '@/libs/mongodb';
import { ClientArticle } from '@/types/Article';
import { ObjectId } from 'mongodb';


async function getCollection(collectionName: string) {
  const client = await clientPromise;
  const db = client.db('travel');
  return db.collection(collectionName);
}

export async function fetchArticle(): Promise<ClientArticle[]>{
  noStore()
  try{
    const articleCollection = await getCollection('articles');
    const data = await articleCollection.find({}).toArray();
    const articles = data.map((article) => ({
      id: article._id.toString(),
      author: article.author,
      title: article.title,
      content: article.content,
      createdAt: article.createdAt.toISOString().split('T')[0]
    }))
    return articles
  }catch(error){
    console.error('Database Error:', error);
    throw new Error('Failed to fetch article data.');
  }
}

export async function fetchArticleById(articleId: string): Promise<ClientArticle | null>{
  noStore()
  try{
    const articleCollection = await getCollection('articles');
    const article = await articleCollection.findOne({_id: new ObjectId(articleId)});
    if(!article){
      return null
    }
    return {
      id: article._id.toString(),
      author: article.author,
      title: article.title,
      content: article.content,
      createdAt: article.createdAt.toLocaleDateString().split('T')[0]
    }
  }catch(error){
    console.error('Database Error:', error);
    throw new Error('Failed to fetch user data.');
  }

}