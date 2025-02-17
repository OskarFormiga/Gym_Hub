import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  Modal,
  ActivityIndicator,
  TextInput,
} from "react-native";
import {
  displayRange,
  fetchGyms,
  fetchUserGyms,
  getTotal,
  gymUpdatedHandler,
  showGymHandler,
} from "./GymsViewPresenter";
import styles from "../../../screens/MainScreens/Gyms/styles/UsersStyles";
import { useUser } from "../../../context/UserContext";
import { Gym } from "../../../interfaces/interfaces";
import GymItem from "../../../screens/MainScreens/components/GymItem";
import GymComponent from "../GymProfile/GymProfileComponent";
import UserGymItem from "../../../screens/MainScreens/components/UserGymItem";
import { DocumentData } from "firebase/firestore";
import { SymbolView } from "expo-symbols";
import { useTranslation } from "react-i18next"; // Import useTranslation hook

const GymsViewComponent = () => {
  const { t } = useTranslation(); // useTranslation hook
  const [gyms, setGyms] = useState<(Gym | null)[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [lastPage, setLastPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [lastVisible, setLastVisible] = useState<DocumentData | null>(null);
  const [firstVisible, setFirstVisible] = useState<DocumentData | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalGymId, setModalGymId] = useState("");
  const [currentGyms, setCurrentGyms] = useState(true);
  const [gymUpdatedCounter, setGymUpdatedCounter] = useState(0);
  const [isRegisted, setIsRegistered] = useState(false);
  const { user } = useUser();
  const itemsPerPage = 5;

  useEffect(() => {
    if (!!user) {
      getTotal(
        setTotal,
        setLastPage,
        itemsPerPage,
        searchQuery,
        currentGyms,
        user?.uid
      );
      fetchGyms(
        setIsLoading,
        searchQuery,
        lastVisible,
        firstVisible,
        currentPage,
        itemsPerPage,
        setCurrentPage,
        setFirstVisible,
        setLastVisible,
        setGyms
      );
    }
  }, []);

  useEffect(() => {
    if (!!user) {
      getTotal(
        setTotal,
        setLastPage,
        itemsPerPage,
        searchQuery,
        currentGyms,
        user?.uid
      );
      currentGyms
        ? fetchUserGyms(
            setIsLoading,
            lastVisible,
            firstVisible,
            currentPage,
            itemsPerPage,
            setCurrentPage,
            setFirstVisible,
            setLastVisible,
            setGyms,
            user.uid
          )
        : fetchGyms(
            setIsLoading,
            searchQuery,
            lastVisible,
            firstVisible,
            currentPage,
            itemsPerPage,
            setCurrentPage,
            setFirstVisible,
            setLastVisible,
            setGyms
          );
    }
  }, [currentGyms, gymUpdatedCounter]);

  return (
    <View style={styles.main}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.pendingButton}
          onPress={() => {
            setCurrentGyms(!currentGyms);
          }}
        >
          <Text style={styles.pendingButtonText}>
            {currentGyms
              ? t("GymsViewComponent.searchCentersButton")
              : t("GymsViewComponent.myCentersButton")}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.searchBarContainer}>
        <TextInput
          placeholder={t("GymsViewComponent.searchPlaceholder")}
          onChangeText={(text) => setSearchQuery(text)}
          value={searchQuery}
          style={styles.searchBar}
        />
        <TouchableOpacity
          onPress={() => {
            if (!!user) {
              getTotal(
                setTotal,
                setLastPage,
                itemsPerPage,
                searchQuery,
                currentGyms,
                user?.uid
              );
              setCurrentPage(0);
              fetchGyms(
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
                undefined
              );
            }
          }}
          disabled={isLoading}
        >
          <SymbolView
            name="magnifyingglass"
            style={styles.symbol}
            type="monochrome"
            tintColor={"black"}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.listWrapper}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#000000" />
        ) : (
          <FlatList
            data={gyms.filter((gym): gym is Gym => gym !== null)}
            renderItem={({ item }) =>
              !currentGyms ? (
                <GymItem
                  userId={user?.uid}
                  gym={item}
                  onShowGym={() => {
                    showGymHandler(
                      setModalGymId,
                      setModalVisible,
                      setIsRegistered,
                      modalVisible,
                      item.id,
                      false
                    );
                  }}
                ></GymItem>
              ) : (
                <UserGymItem
                  userId={user?.uid}
                  gym={item}
                  onShowGym={() => {
                    showGymHandler(
                      setModalGymId,
                      setModalVisible,
                      setIsRegistered,
                      modalVisible,
                      item.id,
                      true
                    );
                  }}
                  onGymUpdate={() => {
                    gymUpdatedHandler(setGymUpdatedCounter, gymUpdatedCounter);
                  }}
                  edit={true}
                ></UserGymItem>
              )
            }
            keyExtractor={(item) => item.id}
          />
        )}
      </View>
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          {displayRange(currentPage, itemsPerPage, gyms.length, total)}
        </Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={
              currentPage === 0 || isLoading
                ? styles.disabledButton
                : styles.button
            }
            onPress={() => {
              fetchGyms(
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
                "backward"
              );
            }}
            disabled={currentPage === 0 || isLoading}
          >
            <Text
              style={
                currentPage === 0 || isLoading
                  ? styles.disabledButtonText
                  : styles.buttonText
              }
            >
              {t("GymsViewComponent.previousButton")}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={
              currentPage >= lastPage || isLoading
                ? styles.disabledButton
                : styles.button
            }
            onPress={() => {
              fetchGyms(
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
                "forward"
              );
            }}
            disabled={currentPage >= lastPage || isLoading}
          >
            <Text
              style={
                currentPage >= lastPage || isLoading
                  ? styles.disabledButtonText
                  : styles.buttonText
              }
            >
              {t("GymsViewComponent.nextButton")}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
        presentationStyle="overFullScreen"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <TouchableOpacity
              style={styles.closeIconContainer}
              onPress={() => {
                setModalVisible(false);
              }}
            >
              <SymbolView
                name="multiply"
                style={styles.closeIcon}
                type="monochrome"
                tintColor={"red"}
              />
            </TouchableOpacity>
            <GymComponent
              userId={modalGymId}
              isRegistered={isRegisted}
            ></GymComponent>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default GymsViewComponent;
