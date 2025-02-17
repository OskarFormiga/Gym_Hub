import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import { getUserData, logout } from "./UserPresenter";
import { useUser } from "../../../context/UserContext";
import { useNavigation } from "@react-navigation/native";
import { db, uploadToFirebase } from "../../../firebaseConfig";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import * as ImagePicker from "expo-image-picker";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import { User } from "../../../interfaces/interfaces";
import { SymbolView } from "expo-symbols";
import GymComponent from "../GymProfile/GymProfileComponent";
import { useTranslation } from "react-i18next"; // Import useTranslation hook
import { changeLanguage } from "i18next"; // Import changeLanguage
import UserGymItem from "../../../screens/MainScreens/components/UserGymItem";
import { cat } from "../../../localization/translations";

type UserComponentProps = {
  isRegistered: boolean;
  userId?: string;
};

const UserComponent: React.FC<UserComponentProps> = ({
  isRegistered,
  userId,
}) => {
  const { t, i18n } = useTranslation(); // useTranslation hook
  const [userName, setUserName] = useState("");
  const [lastname, setLastname] = useState("");
  const [avatarUri, setAvatarUri] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [sessions, setSessions] = useState(0);
  const [sessionsMonth, setSessionsMonth] = useState(30);
  const [sessionsYear, setSessionsYear] = useState(130);
  const [birthDate, setBirthDate] = useState("");
  const [description, setDescription] = useState("");
  const [gyms, setGyms] = useState<any[]>([]);
  const [sessionsCompleted, setSessionsCompleted] = useState(12);
  const [isLoading, setIsLoading] = useState(true);
  const { user, setUser } = useUser();
  const navigation = useNavigation();
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({
    userName: false,
    lastname: false,
    city: false,
    country: false,
    birthDate: false,
  });
  const [tempUserName, setTempUserName] = useState("");
  const [tempLastname, setTempLastname] = useState("");
  const [tempCity, setTempCity] = useState("");
  const [tempCountry, setTempCountry] = useState("");
  const [tempBirthDate, setTempBirthDate] = useState("");
  const [tempSessions, setTempSessions] = useState(0);
  const [modalGymView, setModalGymView] = useState(false);
  const [modalGymId, setModalGymId] = useState("");
  const [modalVisibleDelete, setModalVisibleDelete] = useState(false);
  const [updateCounter, setUpdateCounter] = useState(0);
  const [isImageLoading, setIsImageLoading] = useState(true);

  const [showOptions, setShowOptions] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);

  useEffect(() => {
    setSelectedLanguage(i18n.language);
  }, [i18n.language]);

  const removeGym = async (userId: string, gymId: string, onGymUpdate: any) => {
    try {
      const inscriptionRefCol = collection(db, "InscripcionesCentros");
      let q = query(
        inscriptionRefCol,
        where("gymId", "==", gymId),
        where("userId", "==", userId)
      );

      if (q) {
        const snapshot = await getDocs(q);
        snapshot.docs.forEach(async (doc) => {
          await deleteDoc(doc.ref);
        });
      }

      Alert.alert(t("UserComponent.deleteGymSuccess"));
      onGymUpdate();
    } catch (error) {
      console.error(t("UserComponent.deleteGymError"), error);
    }
  };

  const fetchProfileImageUrl = async (userId: string) => {
    const storage = getStorage();
    const storageRef = ref(storage, `profilePictures/${userId}`);
    try {
      return await getDownloadURL(storageRef);
    } catch (error) {
      return defaultImageUri;
    }
  };

  const fetchUserGyms = async () => {
    setGyms([]);

    try {
      let requestsRef = collection(db, "InscripcionesCentros");
      let q = query(
        requestsRef,
        where("userId", "==", userId ? userId : user?.uid)
      );
      const snapshot = await getDocs(q);

      const newUsers = snapshot.docs.map((doc) => {
        return {
          ...(doc.data() as User),
          id: doc.id,
        };
      });
      if (!!newUsers && newUsers.length > 0) {
        const fetchedUsersIds = newUsers.map((doc) => doc.gymId);
        const usersDataPromises = fetchedUsersIds.map((gymId) => {
          const userDocRef = doc(db, "CentrosRegistrados", gymId);
          return getDoc(userDocRef);
        });

        const usersDataSnapshots = await Promise.all(usersDataPromises);
        const usersData = usersDataSnapshots
          .map((docSnap) => {
            if (docSnap.exists()) {
              return {
                name: docSnap.data().name,
                id: docSnap.id,
                avatarUri: docSnap.data().avatarUri,
                ...docSnap.data(),
              };
            } else {
              console.log(`No such document for gym ID: ${docSnap.id}`);
              return null;
            }
          })
          .filter((gym) => gym !== null); // Filtramos los valores null
        setGyms(usersData);
      }
    } catch (error) {
      console.error("Error fetching user data: ", error);
    }
  };

  useEffect(() => {
    async function fetchData() {
      if (!!user) {
        setIsLoading(true);
        fetchUserGyms();
        const userData = await getUserData(userId ? userId : user.uid);
        if (!!userData) {
          setUserName(userData.name);
          setLastname(userData.lastname);
          setCity(userData.city);
          setCountry(userData.country);
          setBirthDate(userData.birthDate);
          setDescription(userData.description);
          setSessions(userData.completedSessions);
          setSessionsMonth(userData.completedSessionsMonth);
          setSessionsYear(userData.completedSessionsYear);
          setTempUserName(userData.name);
          setTempLastname(userData.lastname);
          setTempCity(userData.city);
          setTempCountry(userData.country);
          setTempBirthDate(userData.birthDate);
          setTempSessions(userData.completedSessions);

          // Obtén la URL de la imagen de perfil desde Firebase Storage
          if (userData.avatarUri) {
            setAvatarUri(userData.avatarUri);
            setIsImageLoading(false);
            setIsLoading(false);
          }
          if (userId || user.uid) {
            fetchProfileImageUrl(userId ? userId : user.uid)
              .then((url) => {
                setAvatarUri(url);
                setIsImageLoading(false);
                setIsLoading(false);
              })
              .catch((error) => {
                console.error("Error fetching profile image URL: ", error);
                setAvatarUri(defaultImageUri); // En caso de error, usa la imagen predeterminada
                setIsImageLoading(false);
                setIsLoading(false);
              });
          }
        }
      }
    }

    fetchData();
  }, [user, updateCounter]);

  const handleCancelEdit = () => {
    setIsEditing(false);
    setTempUserName(userName);
    setTempLastname(lastname);
    setTempCity(city);
    setTempCountry(country);
    setTempBirthDate(birthDate);
  };

  const languages = [
    { code: "en", label: t("LoginScreen.language.english") },
    { code: "es", label: t("LoginScreen.language.spanish") },
    { code: "cat", label: t("LoginScreen.language.catalan") },
  ];

  const handleSaveProfile = async () => {
    if (
      !tempUserName ||
      !tempLastname ||
      !tempCity ||
      !tempCountry ||
      !tempBirthDate
    ) {
      setErrors({
        userName: !tempUserName,
        lastname: !tempLastname,
        city: !tempCity,
        country: !tempCountry,
        birthDate: !tempBirthDate,
      });
      Alert.alert(
        t("UserComponent.profileUpdateError"),
        t("UserComponent.allFieldsRequired")
      );
      return;
    }

    const updatedUser = {
      name: tempUserName,
      lastname: tempLastname,
      city: tempCity,
      country: tempCountry,
      birthDate: tempBirthDate,
    };

    try {
      if (!user) return;
      const userDoc = doc(db, "UsuariosRegistrados", user.uid);
      await updateDoc(userDoc, updatedUser);

      setUserName(tempUserName);
      setLastname(tempLastname);
      setCity(tempCity);
      setCountry(tempCountry);
      setBirthDate(tempBirthDate);

      Alert.alert(t("UserComponent.profileUpdateSuccess"));
    } catch (error) {
      console.error(t("UserComponent.profileUpdateError"), error);
      Alert.alert(t("UserComponent.profileUpdateError"));
    }

    setIsEditing(false);
  };

  const pickImage = async () => {
    // Solicitar permisos para acceder a la galería de fotos
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert(t("UserComponent.permissionError"));
      return;
    }

    // Permitir al usuario seleccionar una imagen de la galería
    const pickerResult = await ImagePicker.launchImageLibraryAsync();
    if (pickerResult.canceled === true) {
      return;
    }

    const { uri } = pickerResult.assets[0];
    const fileName = user?.uid;

    setIsImageLoading(true); // Inicia la carga de la imagen

    try {
      await uploadToFirebase(uri, fileName, "profilePictures");
      setAvatarUri(uri);
      // Actualiza la URL de la imagen en Firestore
    } catch (error) {
      console.error("Error uploading image: ", error);
      Alert.alert(t("UserComponent.uploadError"));
    }

    setIsImageLoading(false);
  };

  const defaultImageUri = "https://via.placeholder.com/120";

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000000" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {!userId && (
        <View style={styles.languageSelectorContainer}>
          <TouchableOpacity
            style={styles.selected}
            onPress={() => {
              setShowOptions(!showOptions);
            }}
          >
            <Text style={styles.selectedText}>
              {languages.find((lang) => lang.code === selectedLanguage)?.label}
            </Text>
          </TouchableOpacity>
          {showOptions && (
            <View style={styles.optionsContainer}>
              {languages
                .filter((lang) => lang.code !== selectedLanguage)
                .map((lang) => (
                  <TouchableOpacity
                    key={lang.code}
                    style={styles.option}
                    onPress={() => {
                      changeLanguage(lang.code);
                      setShowOptions(false);
                    }}
                  >
                    <Text style={styles.optionText}>{lang.label}</Text>
                  </TouchableOpacity>
                ))}
            </View>
          )}
        </View>
      )}
      <View style={styles.header}>
        <TouchableOpacity onPress={pickImage} disabled={!!userId}>
          <Image
            source={{
              uri: avatarUri,
            }}
            style={styles.image}
          />
        </TouchableOpacity>
        <Text style={styles.name}>
          {userName} {lastname}
        </Text>
        <Text style={styles.detail}>
          {city}, {country}
        </Text>
        <Text style={styles.detail}>
          {t("UserComponent.born")} {birthDate}
        </Text>
      </View>

      <View style={styles.sessionsInfo}>
        <Text style={styles.infoTitle}>
          {t("UserComponent.completedSessions")}
        </Text>
        <View style={styles.sessionContainer}>
          <View style={styles.sessionCounter}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{t("UserComponent.year")}</Text>
            </View>
            <View style={styles.center}>
              <Text style={styles.infoTitle}>{sessionsYear}</Text>
            </View>
          </View>
          <View style={styles.sessionCounter}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{t("UserComponent.month")}</Text>
            </View>
            <View style={styles.center}>
              <Text style={styles.infoTitle}>{sessionsMonth}</Text>
            </View>
          </View>
          <View style={styles.sessionCounter}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{t("UserComponent.week")}</Text>
            </View>
            <View style={styles.center}>
              <Text style={styles.infoTitle}>{sessions}</Text>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.gymListContainer}>
        <Text style={styles.infoTitle}>{t("UserComponent.gyms")}</Text>
        {gyms.length > 0 && (
          <FlatList
            data={gyms}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <UserGymItem
                userId={user?.uid}
                gym={item}
                onShowGym={() => {
                  setModalGymView(true);
                  setModalGymId(item.id);
                }}
                onGymUpdate={() => {
                  setModalVisibleDelete(false);
                  setUpdateCounter(updateCounter + 1);
                }}
                edit={!userId}
              ></UserGymItem>
            )}
            style={styles.gymsList}
            contentContainerStyle={styles.gymsListContent}
          />
        )}
      </View>
      {!userId && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={() => {
              setIsEditing(true);
            }}
            style={[styles.button, styles.editButton]}
          >
            <Text style={styles.buttonText}>
              {t("UserComponent.editProfileButton")}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              logout(setUser, navigation);
            }}
            style={[styles.button, styles.logoutButton]}
          >
            <Text style={styles.buttonText}>
              {t("UserComponent.logoutButton")}
            </Text>
          </TouchableOpacity>
        </View>
      )}
      <Modal visible={isEditing} animationType="fade" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>
              {t("UserComponent.editProfileTitle")}
            </Text>
            <View style={styles.row}>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>
                  {t("UserComponent.firstNameLabel")}
                </Text>
                <TextInput
                  style={[styles.input, errors.userName && styles.inputError]}
                  value={tempUserName}
                  onChangeText={(text) => {
                    setTempUserName(text);
                    setErrors({ ...errors, userName: !text });
                  }}
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>
                  {t("UserComponent.lastNameLabel")}
                </Text>
                <TextInput
                  style={[styles.input, errors.lastname && styles.inputError]}
                  value={tempLastname}
                  onChangeText={(text) => {
                    setTempLastname(text);
                    setErrors({ ...errors, lastname: !text });
                  }}
                />
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>{t("UserComponent.cityLabel")}</Text>
                <TextInput
                  style={[styles.input, errors.city && styles.inputError]}
                  value={tempCity}
                  onChangeText={(text) => {
                    setTempCity(text);
                    setErrors({ ...errors, city: !text });
                  }}
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>
                  {t("UserComponent.countryLabel")}
                </Text>
                <TextInput
                  style={[styles.input, errors.country && styles.inputError]}
                  value={tempCountry}
                  onChangeText={(text) => {
                    setTempCountry(text);
                    setErrors({ ...errors, country: !text });
                  }}
                />
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>
                  {t("UserComponent.birthDateLabel")}
                </Text>
                <RNDateTimePicker
                  value={new Date(tempBirthDate)}
                  mode="date"
                  is24Hour={true}
                  onChange={(event: any, selectedDate?: Date) => {
                    if (selectedDate)
                      setTempBirthDate(selectedDate.toDateString());
                  }}
                  themeVariant={"light"}
                />
              </View>
            </View>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={handleCancelEdit}
              >
                <Text style={styles.buttonText}>
                  {t("UserComponent.cancelButton")}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSaveProfile}
              >
                <Text style={styles.buttonText}>
                  {t("UserComponent.saveButton")}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalGymView}
        onRequestClose={() => {
          setModalGymView(!modalGymView);
        }}
        presentationStyle="overFullScreen"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <TouchableOpacity
              style={styles.closeIconContainer}
              onPress={() => {
                setModalGymView(false);
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
              isRegistered={isRegistered ? isRegistered : true}
              userId={modalGymId}
            ></GymComponent>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisibleDelete}
        onRequestClose={() => {
          setModalVisibleDelete(!modalVisibleDelete);
        }}
        presentationStyle="overFullScreen"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>
              {t("UserComponent.deleteGymConfirmation")}
            </Text>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisibleDelete(false)}
              >
                <Text style={styles.buttonText}>
                  {t("UserComponent.cancelButton")}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={() => {
                  removeGym(user?.uid || "", modalGymId, () => {
                    setModalVisibleDelete(false);
                    setUpdateCounter(updateCounter + 1);
                  });

                  setModalVisibleDelete(false);
                }}
              >
                <Text style={styles.buttonText}>
                  {t("UserComponent.saveButton")}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  closeIconContainer: {
    position: "absolute",
    top: 15,
    right: 15,
    zIndex: 1,
  },
  closeIcon: {
    width: 25,
    height: 25,
    margin: 6,
  },
  modalView: {
    margin: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    minWidth: "90%",
    maxHeight: "80%",
    display: "flex",
    flexDirection: "column",
    alignContent: "center",
    justifyContent: "center",
  },
  symbol: {
    width: 35,
    height: 35,
    margin: 5,
  },
  symbol2: {
    width: 40,
    height: 30,
    margin: 5,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  modalText: {
    fontSize: 18,
    color: "#666666",
    marginBottom: 10,
    textAlign: "center",
    lineHeight: 22,
  },
  modalContainer: {
    width: "90%",
    padding: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
    borderWidth: 1,
    borderColor: "#DDDDDD",
    position: "relative",
  },
  modalTitle: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333333",
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  inputContainer: {
    flex: 1,
    marginBottom: 10,
    marginHorizontal: 5,
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
  },
  label: {
    fontSize: 18,
    color: "#333",
    marginBottom: 10,
    fontWeight: "600",
  },
  input: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#000000",
    borderRadius: 5,
    backgroundColor: "#FFFFFF",
    color: "#333333",
    fontSize: 16,
  },
  inputError: {
    borderColor: "#FF0000",
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
    width: "100%",
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: "center",
    width: 150,
    height: 40,
  },
  saveButton: {
    backgroundColor: "#eeeeee",
  },
  cancelButton: {
    backgroundColor: "#eeeeee",
  },
  container: {
    flex: 1,
    minWidth: "100%",
    backgroundColor: "white",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
    height: "27%",
    marginTop: 5,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
  },
  name: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 5,
  },
  detail: {
    fontSize: 16,
    color: "#666666",
  },
  gymListContainer: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#000000",
    paddingHorizontal: 20,
    paddingVertical: 10,
    height: "38%",
  },
  sessionsInfo: {
    borderTopWidth: 1,
    borderColor: "#000000",
    paddingHorizontal: 20,
    paddingVertical: 10,
    height: "20%",
  },
  infoSection: {
    marginBottom: 20,
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#F5F5F5",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  sessionContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  sessionCounter: {
    width: 90,
    height: 90,
    backgroundColor: "#eeeeee",
    borderRadius: 10,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    borderColor: "black",
    borderWidth: 1,
  },
  center: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "75%",
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    backgroundColor: "white",
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333333",
  },
  titleContainer: {
    width: "100%",
    height: "25%",
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 1,
    borderColor: "#000000",
  },
  infoContent: {
    fontSize: 16,
    color: "#666666",
  },
  gymsList: {
    height: 250,
  },
  gymsListContent: {
    marginTop: 5,
  },
  gymContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 7,
    backgroundColor: "#bbbbbb",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginBottom: 10,
    width: "100%",
    borderColor: "black",
    borderWidth: 1,
  },
  gymImage: {
    width: 40,
    height: 40,
    borderRadius: 30,
    marginRight: 10,
  },
  gymName: {
    fontSize: 16,
    color: "#000000",
    flex: 1,
    fontWeight: "bold",
  },
  viewGymButton: {
    backgroundColor: "#000000",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginLeft: 8,
  },
  viewGymButtonText: {
    color: "#000000",
    fontSize: 14,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
    alignItems: "center",
    height: "8%",
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: "center",
    width: 200,
    height: 40,
  },
  editButton: {
    backgroundColor: "#dddddd",
  },
  logoutButton: {
    backgroundColor: "#dddddd",
  },
  buttonText: {
    color: "#000000",
    fontWeight: "bold",
    fontSize: 14,
  },
  languageSelectorContainer: {
    position: "absolute",
    top: 20,
    right: 20,
    alignItems: "center",
    zIndex: 100,
  },
  selected: {
    padding: 10,
    backgroundColor: "#000000",
    borderRadius: 8,
    alignItems: "center",
    width: 80,
  },
  selectedText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  optionsContainer: {
    alignItems: "center",
  },
  option: {
    padding: 10,
    backgroundColor: "#555555",
    borderRadius: 8,
    marginTop: 5,
    alignItems: "center",
    width: 80,
  },
  optionText: {
    color: "#ffffff",
    fontSize: 16,
  },
});

export default UserComponent;
