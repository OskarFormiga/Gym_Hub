import { Timestamp } from "firebase/firestore";

export interface User {
  userId: string;
  id: string;
  name: string;
  email: string;
  lastname: string;
  country: string;
  city: string;
  birthDate: string;
  avatarUri: string;
  gymId: string;
}

export interface Request {
  id: string;
  userId: string;
  gymId: string;
  status: string;
}

export interface Gym {
  avatarUri: string;
  id: string;
  name: string;
  location: string;
  city: string;
  country: string;
}

export interface Inscription {
  gymId: string;
  userId: string;
  joinDate: Date;
}

export interface Activity {
  id: string;
  gymId: string;
  name: string;
  description: string;
}

export interface Session {
  id: string;
  gymId: string;
  name: string;
  description: string;
}
