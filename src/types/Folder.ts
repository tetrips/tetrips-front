import { ObjectId } from "mongodb";

export interface Folder {
  _id: ObjectId;
  name: string,
  creator: string,
  projectIds?: string[],
}

export interface ClientFolder {
  id: string;
  name: string,
  creator: string,
  projectIds?: string[],
}