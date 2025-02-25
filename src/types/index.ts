import { ObjectId } from './utils';

export interface UserDTO {
  username: string;
  password: string;
}

export interface User {
  _id: ObjectId;
  username: string;
  password?: string;
  avatar: string;
  completedQuests: QuestCompletion[];
  friends: ObjectId[];
  createdAt: Date;
  updatedAt: Date;
  id?: string;
}

export interface Location {
  _id: ObjectId;
  name: string;
  latitude: number;
  longitude: number;
  continent: string;
  country: string;
  city: string;
}

export interface MapState {
  longitude: number;
  latitude: number;
  zoom: number;
}

export interface Quest {
  _id: ObjectId;
  country: string;
  city: string;
  coordinates: {
    longitude: number;
    latitude: number;
    zoom: number;
  };
  description: string;
  photoUrl: string;
  coupon: string;
  completionDate?: Date;
}

export interface QuestCompletion {
  _id: ObjectId;
  country: string;
  city: string;
  description: string;
  comment: string;
  photoUrl: string;
  images: string[];
  coupon: string;
  completionDate: Date;
}

export interface Friend {
  _id: ObjectId;
  userId: ObjectId;
  addedAt: Date;
  username: string;
  avatar: string;
}
