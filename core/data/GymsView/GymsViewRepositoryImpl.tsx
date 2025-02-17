import { GymsViewRepository } from "../../domain/GymsView/GymsViewRepository";
import {
  collection,
  doc,
  endAt,
  getCountFromServer,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  startAt,
  where,
} from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import { Gym, User } from "../../../interfaces/interfaces";

export class GymsViewRepositoryImpl implements GymsViewRepository {
  async getTotal(
    setTotal: (total: number) => void,
    setLastPage: (lastPage: number) => void,
    itemsPerPage: number,
    searchQuery: string,
    currentGyms: boolean,
    userId: string
  ) {
    if (!currentGyms) {
      const gymsRef = collection(db, "CentrosRegistrados");
      let q, snapshot;
      const searchPrefix = searchQuery;
      const upperBound = searchPrefix + "\uf8ff";
      if (searchQuery != "") {
        q = query(
          gymsRef,
          orderBy("name"),
          startAt(searchPrefix),
          endAt(upperBound)
        );
        snapshot = await getDocs(q);
        setTotal(snapshot.size);
        setLastPage(Math.ceil(snapshot.size / itemsPerPage) - 1);
      } else {
        snapshot = await getCountFromServer(gymsRef);
        setTotal(snapshot.data().count);
        setLastPage(Math.ceil(snapshot.data().count / itemsPerPage) - 1);
      }
    } else {
      const gymsRef = collection(db, "InscripcionesCentros");
      let q, snapshot;
      const searchPrefix = searchQuery;
      const upperBound = searchPrefix + "\uf8ff";
      if (searchQuery != "") {
        q = query(
          gymsRef,
          where("userId", "==", userId),
          orderBy("name"),
          startAt(searchPrefix),
          endAt(upperBound)
        );
        snapshot = await getDocs(q);
        setTotal(snapshot.size);
        setLastPage(Math.ceil(snapshot.size / itemsPerPage) - 1);
      } else {
        q = query(gymsRef, where("userId", "==", userId));
        snapshot = await getDocs(q);
        setTotal(snapshot.size);
        setLastPage(Math.ceil(snapshot.size / itemsPerPage) - 1);
      }
    }
  }

  async fetchGyms(
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
    setIsLoading(true);
    const gymsRef = collection(db, "CentrosRegistrados");
    let q;
    let offset = 0;

    if (searchQuery !== "") {
      const searchPrefix = searchQuery;
      const upperBound = searchPrefix + "\uf8ff";

      if (
        (direction === "forward" && lastVisible) ||
        (direction === "backward" && firstVisible && currentPage > 1)
      ) {
        offset =
          (direction === "forward" ? currentPage + 1 : currentPage - 1) *
          itemsPerPage;
        q = query(
          gymsRef,
          orderBy("name"),
          startAt(searchPrefix),
          endAt(upperBound),
          limit((offset + 2) * itemsPerPage)
        );
      } else {
        q = query(
          gymsRef,
          orderBy("name"),
          startAt(searchPrefix),
          endAt(upperBound),
          limit(itemsPerPage)
        );
        setCurrentPage(0);
      }
    } else {
      if (direction === "forward" && lastVisible) {
        q = query(
          gymsRef,
          orderBy("name"),
          startAfter(lastVisible),
          limit(itemsPerPage)
        );
        setCurrentPage(currentPage + 1);
      } else if (direction === "backward" && firstVisible && currentPage > 1) {
        offset = (currentPage - 1) * itemsPerPage;
        q = query(gymsRef, orderBy("name"), limit(offset + itemsPerPage));
      } else {
        q = query(gymsRef, orderBy("name"), limit(itemsPerPage));
        setCurrentPage(0);
      }
    }

    if (q) {
      const snapshot = await getDocs(q);
      let newGyms = snapshot.docs.map((doc) => ({
        ...(doc.data() as Gym),
        id: doc.id,
      }));
      setFirstVisible(snapshot.docs[offset]);
      setLastVisible(snapshot.docs[offset + itemsPerPage - 1]);
      if (
        newGyms.length > 0 &&
        (direction === "forward" || direction === "backward")
      ) {
        newGyms = newGyms.slice(offset, offset + itemsPerPage);
        setCurrentPage(
          direction === "forward" ? currentPage + 1 : currentPage - 1
        );
      }
      setGyms(newGyms);
    }
    setIsLoading(false);
  }

  async fetchUserGyms(
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
    setIsLoading(true);
    setGyms([]);

    try {
      let requestsRef = collection(db, "InscripcionesCentros");

      let q;
      let offset = 0;

      if (direction === "forward" && lastVisible) {
        offset = (currentPage + 1) * itemsPerPage;
        q = query(
          requestsRef,
          where("userId", "==", userId),
          orderBy("gymId"),
          limit(offset + itemsPerPage)
        );
        setCurrentPage(currentPage + 1);
      } else if (direction === "backward" && firstVisible && currentPage > 1) {
        offset = (currentPage - 1) * itemsPerPage;
        q = query(
          requestsRef,
          where("userId", "==", userId),
          orderBy("gymId"),
          limit(offset + itemsPerPage)
        );
      } else {
        q = query(
          requestsRef,
          where("userId", "==", userId),
          orderBy("gymId"),
          limit(itemsPerPage)
        );
        setCurrentPage(0);
      }
      let newUsers;
      if (q) {
        const snapshot = await getDocs(q);
        newUsers = snapshot.docs.map((doc) => ({
          ...(doc.data() as User),
          id: doc.id,
        }));
        setFirstVisible(snapshot.docs[offset]);
        setLastVisible(snapshot.docs[offset + itemsPerPage - 1]);

        if (
          !!newUsers &&
          newUsers.length > 0 &&
          (direction === "forward" || direction === "backward")
        ) {
          newUsers = newUsers.slice(offset, offset + itemsPerPage);
          setCurrentPage(
            direction === "forward" ? currentPage + 1 : currentPage - 1
          );
        }
      }

      if (!!newUsers && newUsers.length > 0) {
        const fetchedUsersIds = newUsers.map((doc) => doc.gymId);
        const usersDataPromises = fetchedUsersIds.map((gymId) => {
          const userDocRef = doc(db, "CentrosRegistrados", gymId);
          return getDoc(userDocRef);
        });

        const usersDataSnapshots = await Promise.all(usersDataPromises);
        const usersData = usersDataSnapshots.map((docSnap) => {
          if (docSnap.exists()) {
            return {
              ...docSnap.data(),
              id: docSnap.id,
            } as Gym;
          } else {
            console.log(`No such document for user ID: ${docSnap.id}`);
            return null;
          }
        });
        setGyms(usersData);
      }
    } catch (error) {
      console.error("Error fetching user data: ", error);
    }
    setIsLoading(false);
  }
}
