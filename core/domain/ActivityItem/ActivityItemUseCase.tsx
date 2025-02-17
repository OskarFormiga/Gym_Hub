import { CommonActions } from "@react-navigation/native";
import { doc, deleteDoc } from "firebase/firestore";
import { Alert } from "react-native";
import { db } from "../../../firebaseConfig";

export class ActivityServiceImpl {
  constructor() {}

  async removeActivity(activityId: string, onActivityUpdate: () => void) {
    try {
      const userDoc = doc(db, "Activities", activityId);
      await deleteDoc(userDoc);

      Alert.alert("Actividad eliminada");
      onActivityUpdate();
    } catch (error) {
      console.error("Error deleting activity: ", error);
    }
  }
}
