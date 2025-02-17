import { Gym } from "./GymProfile";
import { GymRepository } from "../../domain/GymProfile/GymProfileRepository";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import { Activity } from "../../../interfaces/interfaces";

export class GymRepositoryImpl implements GymRepository {
  async getGymData(gymId: string): Promise<Gym | null> {
    try {
      const gymDoc = doc(db, "CentrosRegistrados", gymId);
      const docSnap = await getDoc(gymDoc);
      if (docSnap.exists()) {
        const activities = await this.fetchActivities(gymId);
        const gymData = docSnap.data();
        return new Gym(
          gymData.name,
          gymData.location,
          gymData.email,
          gymData.country,
          gymData.city,
          gymData.zipCode,
          activities,
          gymData.avatarUri,
          gymData.description
        );
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error fetching user data: ", error);
    }

    return null;
  }

  async fetchActivities(gymId: string): Promise<Activity[] | null> {
    try {
      let requestsRef = collection(db, "Activities");

      let q = query(requestsRef, where("gymId", "==", gymId), orderBy("name"));

      let newActivities;
      if (q) {
        const snapshot = await getDocs(q);

        newActivities = snapshot.docs.map((doc) => ({
          ...(doc.data() as Activity),
          id: doc.id,
        }));
        return newActivities;
      }
    } catch (error) {
      console.error("Error fetching user data: ", error);
    }
    return null;
  }
}
