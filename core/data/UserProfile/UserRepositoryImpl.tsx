import { User } from "./User";
import { UserRepository } from "../../domain/UserProfile/UserRepository";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebaseConfig";

export class UserRepositoryImpl implements UserRepository {
  async getUserData(userId: string): Promise<User | null> {
    const userDoc = doc(db, "UsuariosRegistrados", userId);
    const docSnap = await getDoc(userDoc);
    if (docSnap.exists()) {
      const userData = docSnap.data();
      return new User(
        userData.name,
        userData.lastname,
        userData.email,
        userData.country,
        userData.city,
        userData.birthDate,
        "",
        "",
        userData.completedSessions,
        userData.completedSessionsMonth ? userData.completedSessionsMonth : 30,
        userData.completedSessionsYear ? userData.completedSessionsYear : 150
      );
    } else {
      console.log("No such document!");
    }
    return null;
  }
}
