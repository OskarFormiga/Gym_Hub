import { CommonActions } from "@react-navigation/native";
import { Gym } from "../../data/GymProfile/GymProfile";
import { GymsViewRepository } from "./GymsViewRepository";

export interface GymsViewService {
  getTotal(
    setTotal: (total: number) => void,
    setLastPage: (lastPage: number) => void,
    itemsPerPage: number,
    searchQuery: string,
    currentGyms: boolean,
    userId: string
  ): void;

  fetchGyms(
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
  ): void;

  fetchUserGyms(
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
  ): void;
}

export class GymsViewServiceImpl implements GymsViewService {
  gymsViewRepo: GymsViewRepository;

  constructor(gymsViewRepo: GymsViewRepository) {
    this.gymsViewRepo = gymsViewRepo;
  }

  getTotal(
    setTotal: (total: number) => void,
    setLastPage: (lastPage: number) => void,
    itemsPerPage: number,
    searchQuery: string,
    currentGyms: boolean,
    userId: string
  ) {
    return this.gymsViewRepo.getTotal(
      setTotal,
      setLastPage,
      itemsPerPage,
      searchQuery,
      currentGyms,
      userId
    );
  }

  fetchGyms(
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
    return this.gymsViewRepo.fetchGyms(
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

  fetchUserGyms(
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
    return this.gymsViewRepo.fetchUserGyms(
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

  displayRange = (
    currentPage: number,
    itemsPerPage: number,
    gymsLength: number,
    total: number
  ) => {
    const start = currentPage * itemsPerPage + 1;
    const end = start + gymsLength - 1;
    return `${start}-${end} of ${total} gyms`;
  };

  showGymHandler(
    setModalGymId: (modalGymId: string) => void,
    setModalVisible: (modalVisible: boolean) => void,
    setIsRegistered: (isRegistered: boolean) => void,
    modalVisible: boolean,
    itemId: string,
    isRegisted: boolean
  ) {
    setModalGymId(itemId);
    setIsRegistered(isRegisted);
    setModalVisible(!modalVisible);
  }

  gymUpdatedHandler(
    setGymUpdatedCounter: (gymUpdatedCounter: number) => void,
    gymUpdatedCounter: number
  ) {
    setGymUpdatedCounter(gymUpdatedCounter + 1);
  }
}
