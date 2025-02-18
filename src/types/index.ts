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
  description: string;
  photoUrl: string;
  coupon: string;
  completedAt?: Date;
}

export interface QuestCompletion {
  _id: ObjectId;
  country: string;
  city: string;
  description: string;
  photoUrl: string;
  photos: string[];
  coupon: string;
  completedAt?: Date;
}

export interface Friend {
  _id: ObjectId;
  userId: ObjectId;
  friendId: ObjectId;
  createdAt: Date;
}
