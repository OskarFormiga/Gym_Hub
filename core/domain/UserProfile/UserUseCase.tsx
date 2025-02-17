import { CommonActions } from "@react-navigation/native";
import { User } from "../../data/UserProfile/User";
import { UserRepository } from "./UserRepository";

export interface UserService {
  getUserData(userId: string): Promise<User | null>;
}

export class UserServiceImpl implements UserService {
  userRepo: UserRepository;

  constructor(userRepo: UserRepository) {
    this.userRepo = userRepo;
  }

  getUserData(userId: string): Promise<User | null> {
    return this.userRepo.getUserData(userId);
  }

  logout(setUser: (user: null) => void, navigation: any): void {
    setUser(null);
    navigation.dispatch(
      CommonActions.reset({ index: 0, routes: [{ name: "Auth" }] })
    );
  }
}
