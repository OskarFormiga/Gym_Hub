import { ActivityServiceImpl } from "../../domain/ActivityItem/ActivityItemUseCase";

export function removeActivity(
  activityId: string,
  onActivityUpdate: () => void
) {
  let activityService = new ActivityServiceImpl();
  return activityService.removeActivity(activityId, onActivityUpdate);
}
