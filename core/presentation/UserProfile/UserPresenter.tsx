import { UserServiceImpl } from "../../domain/UserProfile/UserUseCase";
import { UserRepositoryImpl } from "../../data/UserProfile/UserRepositoryImpl";

export function getUserData(userId: string) {
  let userRepository = new UserRepositoryImpl();
  let userService = new UserServiceImpl(userRepository);
  return userService.getUserData(userId);
}

export function logout(setUser: (user: null) => void, navigation: any) {
  let userRepository = new UserRepositoryImpl();
  let userService = new UserServiceImpl(userRepository);
  return userService.logout(setUser, navigation);
}
