import { ObjectId } from "mongodb";

export interface Project {
  _id: ObjectId;
  creator: string;
  title: string;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  guests: Guest[];
  itineraries: Itinerary[];
}

export interface ClientProject {
  id: string;
  creator: string;
  title: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  guests: Guest[];
  itineraries: Itinerary[];
}

export interface Guest {
  email: string;
  nickname: string;
  img: string;
}

export interface Itinerary {
  itineraryId: string;
  date: string;
  dayStartTime: string;
  startPlace?: Destination;
  endPlace?: Destination;
  destinations: Destination[];
}

export interface Destination {
  id: string;
  placeId:string;
  title: string;
  roadAddress: string;
  category: string;
  mapx: number;
  mapy: number;
  link?: string;
  stayDuration: number;
  startTime?: string;
  endTime?: string;
}


