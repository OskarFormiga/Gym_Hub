import { CommonActions } from "@react-navigation/native";
import { Gym } from "../../data/GymProfile/GymProfile";
import { GymRepository } from "./GymProfileRepository";

export interface GymService {
  getGymData(gymId: string): Promise<Gym | null>;
}

export class GymServiceImpl implements GymService {
  gymRepo: GymRepository;

  constructor(gymRepo: GymRepository) {
    this.gymRepo = gymRepo;
  }

  getGymData(gymId: string): Promise<Gym | null> {
    return this.gymRepo.getGymData(gymId);
  }

  logout(setGym: (gym: null) => void, navigation: any): void {
    setGym(null);
    navigation.dispatch(
      CommonActions.reset({ index: 0, routes: [{ name: "Auth" }] })
    );
  }

  showActivityHandler(
    setShowActivityVisible: (showActivityVisible: boolean) => void,
    setModalActivityId: (activityId: string) => void,
    activityId: string,
    showActivityVisible: boolean
  ) {
    setModalActivityId(activityId);
    setShowActivityVisible(!showActivityVisible);
  }

  showActivityVisibleHandler(
    setShowActivityVisible: (showActivityVisible: boolean) => void,
    showActivityVisible: boolean
  ) {
    setShowActivityVisible(!showActivityVisible);
  }

  activityUpdateHandler(
    setActivityUpdatedCounter: (showActivityVisible: number) => void,
    activityUpdatedCounter: number
  ) {
    setActivityUpdatedCounter(activityUpdatedCounter + 1);
  }
}
