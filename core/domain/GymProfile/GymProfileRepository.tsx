import { Gym } from "../../data/GymProfile/GymProfile";

export interface GymRepository {
  getGymData(gymId: string): Promise<Gym | null>;
}
