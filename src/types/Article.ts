import { ObjectId } from "mongodb";

export interface Article {
  _id?: ObjectId;
  author?:string;
  title: string;
  content: string;
  createdAt?: Date;
}

export interface ClientArticle {
  id: string;
  author?: string;
  title: string;
  content: string;
  createdAt?: string;
}