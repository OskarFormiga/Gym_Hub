import { Gym } from "../../data/GymProfile/GymProfile";

export interface GymsViewRepository {
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
