import { GymServiceImpl } from "../../domain/GymProfile/GymProfileUseCase";
import { GymRepositoryImpl } from "../../data/GymProfile/GymProfileRepositoryImpl";

export function getGymData(gymId: string) {
  let gymRepository = new GymRepositoryImpl();
  let gymService = new GymServiceImpl(gymRepository);
  return gymService.getGymData(gymId);
}

export function logout(setGym: (gym: null) => void, navigation: any) {
  let gymRepository = new GymRepositoryImpl();
  let gymService = new GymServiceImpl(gymRepository);
  return gymService.logout(setGym, navigation);
}

export function showActivityHandler(
  setShowActivityVisible: (showActivityVisible: boolean) => void,
  setModalActivityId: (activityId: string) => void,
  activityId: string,
  showActivityVisible: boolean
) {
  let gymRepository = new GymRepositoryImpl();
  let gymService = new GymServiceImpl(gymRepository);
  return gymService.showActivityHandler(
    setShowActivityVisible,
    setModalActivityId,
    activityId,
    showActivityVisible
  );
}

export function showActivityVisibleHandler(
  setShowActivityVisible: (showActivityVisible: boolean) => void,
  showActivityVisible: boolean
) {
  let gymRepository = new GymRepositoryImpl();
  let gymService = new GymServiceImpl(gymRepository);
  return gymService.showActivityVisibleHandler(
    setShowActivityVisible,
    showActivityVisible
  );
}

export function activityUpdateHandler(
  setActivityUpdatedCounter: (showActivityVisible: number) => void,
  activityUpdatedCounter: number
) {
  let gymRepository = new GymRepositoryImpl();
  let gymService = new GymServiceImpl(gymRepository);
  return gymService.activityUpdateHandler(
    setActivityUpdatedCounter,
    activityUpdatedCounter
  );
}
