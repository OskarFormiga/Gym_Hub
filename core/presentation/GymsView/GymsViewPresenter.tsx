import { GymsViewServiceImpl } from "../../domain/GymsView/GymsViewUseCase";
import { GymsViewRepositoryImpl } from "../../data/GymsView/GymsViewRepositoryImpl";

export function showGymHandler(
  setModalGymId: (modalGymId: string) => void,
  setModalVisible: (modalVisible: boolean) => void,
  setIsRegistered: (isRegistered: boolean) => void,
  modalVisible: boolean,
  itemId: string,
  isRegisted: boolean
) {
  let gymsViewRepository = new GymsViewRepositoryImpl();
  let gymsViewService = new GymsViewServiceImpl(gymsViewRepository);
  return gymsViewService.showGymHandler(
    setModalGymId,
    setModalVisible,
    setIsRegistered,
    modalVisible,
    itemId,
    isRegisted
  );
}

export function gymUpdatedHandler(
  setGymUpdatedCounter: (gymUpdatedCounter: number) => void,
  gymUpdatedCounter: number
) {
  let gymsViewRepository = new GymsViewRepositoryImpl();
  let gymsViewService = new GymsViewServiceImpl(gymsViewRepository);
  return gymsViewService.gymUpdatedHandler(
    setGymUpdatedCounter,
    gymUpdatedCounter
  );
}

export function displayRange(
  currentPage: number,
  itemsPerPage: number,
  gymsLength: number,
  total: number
): String {
  let gymsViewRepository = new GymsViewRepositoryImpl();
  let gymsViewService = new GymsViewServiceImpl(gymsViewRepository);
  return gymsViewService.displayRange(
    currentPage,
    itemsPerPage,
    gymsLength,
    total
  );
}

export function fetchGyms(
  setIsLoading: (isLoading: boolean) => void,
  searchQuery: string,
  lastVisible: any,
  firstVisible: any,
  currentPage: number,
  itemsPerPage: number,
  setCurrentPage: (currentPage: number) => void,
  setFirstVisible: any,
  setLastVisible: any,
  setGyms: any,
  direction?: string
) {
  let gymsViewRepository = new GymsViewRepositoryImpl();
  let gymsViewService = new GymsViewServiceImpl(gymsViewRepository);
  return gymsViewService.fetchGyms(
    setIsLoading,
    searchQuery,
    lastVisible,
    firstVisible,
    currentPage,
    itemsPerPage,
    setCurrentPage,
    setFirstVisible,
    setLastVisible,
    setGyms,
    direction
  );
}

export function fetchUserGyms(
  setIsLoading: (isLoading: boolean) => void,
  lastVisible: any,
  firstVisible: any,
  currentPage: number,
  itemsPerPage: number,
  setCurrentPage: (currentPage: number) => void,
  setFirstVisible: any,
  setLastVisible: any,
  setGyms: any,
  userId: string,
  direction?: string
) {
  let gymsViewRepository = new GymsViewRepositoryImpl();
  let gymsViewService = new GymsViewServiceImpl(gymsViewRepository);
  return gymsViewService.fetchUserGyms(
    setIsLoading,
    lastVisible,
    firstVisible,
    currentPage,
    itemsPerPage,
    setCurrentPage,
    setFirstVisible,
    setLastVisible,
    setGyms,
    userId,
    direction
  );
}

export function getTotal(
  setTotal: (total: number) => void,
  setLastPage: (lastPage: number) => void,
  itemsPerPage: number,
  searchQuery: string,
  currentGyms: boolean,
  userId: string
) {
  let gymsViewRepository = new GymsViewRepositoryImpl();
  let gymsViewService = new GymsViewServiceImpl(gymsViewRepository);
  return gymsViewService.getTotal(
    setTotal,
    setLastPage,
    itemsPerPage,
    searchQuery,
    currentGyms,
    userId
  );
}
