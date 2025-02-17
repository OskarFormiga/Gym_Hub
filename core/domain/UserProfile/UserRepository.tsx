import { User } from "../../data/UserProfile/User";

export interface UserRepository {
  getUserData(userId: string): Promise<User | null>;
}
