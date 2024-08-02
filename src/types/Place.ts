import { ObjectId } from "mongodb";

export interface Place {
  _id?: ObjectId;
  title: string;
  roadAddress: string;
  category: string;
  mapx: number;
  mapy: number;
  link?: string;
}
export interface ClientPlace {
  id: string;
  title: string;
  roadAddress: string;
  category: string;
  mapx: number;
  mapy: number;
  link?: string;
}