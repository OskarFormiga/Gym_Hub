import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  Modal,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import {
  activityUpdateHandler,
  getGymData,
  logout,
  showActivityHandler,
  showActivityVisibleHandler,
} from "./GymProfilePresenter";
import { useUser } from "../../../context/UserContext";
import { useNavigation } from "@react-navigation/native";
import { Activity } from "../../../interfaces/interfaces";
import ShowActivity from "../../../screens/MainScreens/components/ShowActivity";
import ActivityItemComponent from "../ActivityItem/ActivityItemComponent";
import { SymbolView } from "expo-symbols";
import { doc, updateDoc } from "firebase/firestore";
import { db, uploadToFirebase } from "../../../firebaseConfig";
import { useTranslation } from "react-i18next"; // Import useTranslation hook
import * as ImagePicker from "expo-image-picker";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { changeLanguage } from "i18next";

type UserComponentProps = {
  isRegistered: boolean;
  userId?: string;
};

const GymComponent: React.FC<UserComponentProps> = ({
  isRegistered,
  userId,
}) => {
  const { t, i18n } = useTranslation(); // useTranslation hook
  const [gymName, setGymName] = useState("");
  const [location, setLocation] = useState("");
  const [avatarUri, setAvatarUri] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [description, setDescription] = useState("");
  const [activities, setActivities] = useState<Activity[] | null>([]);
  const [showActivityVisible, setShowActivityVisible] = useState(false);
  const [modalActivityId, setModalActivityId] = useState("");
  const [activityUpdatedCounter, setActivityUpdatedCounter] = useState(0);
  const { user, setUser } = useUser();
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({
    gymName: false,
    location: false,
    city: false,
    country: false,
    zipCode: false,
  });
  const [tempGymName, setTempGymName] = useState("");
  const [tempLocation, setTempLocation] = useState("");
  const [tempCity, setTempCity] = useState("");
  const [tempCountry, setTempCountry] = useState("");
  const [tempZipCode, setTempZipCode] = useState("");
  const [tempDescription, setTempDescription] = useState("");
  const [isImageLoading, setIsImageLoading] = useState(true);

  const defaultImageUri = "https://via.placeholder.com/150";

  const fetchProfileImageUrl = async (userId: string) => {
    const storage = getStorage();
    const storageRef = ref(storage, `profilePictures/${userId}`);
    try {
      return await getDownloadURL(storageRef);
    } catch (error) {
      return defaultImageUri;
    }
  };

  const [showOptions, setShowOptions] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);

  useEffect(() => {
    setSelectedLanguage(i18n.language);
  }, [i18n.language]);

  useEffect(() => {
    async function fetchData() {
      if (!!user) {
        setIsLoading(true);
        const gymData = await getGymData(userId ? userId : user.uid);
        if (!!gymData) {
          setGymName(gymData.name);
          setLocation(gymData.location);
          setCity(gymData.city);
          setCountry(gymData.country);
          setZipCode(gymData.zipCode);
          setDescription(gymData.description);
          setActivities(gymData.activities);
          setTempGymName(gymData.name);
          setTempLocation(gymData.location);
          setTempCity(gymData.city);
          setTempCountry(gymData.country);
          setTempZipCode(gymData.zipCode);
          setTempDescription(gymData.description);
          // Obtén la URL de la imagen de perfil desde Firebase Storage
          if (gymData.avatarUri) {
            setAvatarUri(gymData.avatarUri);
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
  }, [user, activityUpdatedCounter]);

  const handleCancelEdit = () => {
    setIsEditing(false);
    setTempGymName(gymName);
    setTempLocation(location);
    setTempCity(city);
    setTempCountry(country);
    setTempZipCode(zipCode);
    setTempDescription(description);
  };

  const languages = [
    { code: "en", label: t("LoginScreen.language.english") },
    { code: "es", label: t("LoginScreen.language.spanish") },
    { code: "cat", label: t("LoginScreen.language.catalan") },
  ];

  const handleSaveProfile = async () => {
    if (
      !tempGymName ||
      !tempLocation ||
      !tempCity ||
      !tempCountry ||
      !tempZipCode
    ) {
      setErrors({
        gymName: !tempGymName,
        location: !tempLocation,
        city: !tempCity,
        country: !tempCountry,
        zipCode: !tempZipCode,
      });
      Alert.alert(
        t("UserProfile.errorMessage"),
        t("UserProfile.allFieldsRequired")
      );
      return;
    }

    const updatedGym = {
      name: tempGymName,
      location: tempLocation,
      city: tempCity,
      country: tempCountry,
      zipCode: tempZipCode,
      description: tempDescription,
    };

    try {
      if (!user) return;
      const gymDoc = doc(db, "CentrosRegistrados", user.uid);
      await updateDoc(gymDoc, updatedGym);

      setGymName(tempGymName);
      setLocation(tempLocation);
      setCity(tempCity);
      setCountry(tempCountry);
      setZipCode(tempZipCode);
      setDescription(tempDescription);

      Alert.alert(t("UserProfile.successMessage"));
    } catch (error) {
      console.error("Error updating profile: ", error);
      Alert.alert(t("UserProfile.errorMessage"));
    }

    setIsEditing(false);
  };

  const pickImage = async () => {
    // Solicitar permisos para acceder a la galería de fotos
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert(t("UserProfile.permissionError"));
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
      Alert.alert(t("UserProfile.uploadError"));
    }

    setIsImageLoading(false);
  };

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
        <Text style={styles.name}>{gymName}</Text>
        <Text style={styles.detail}>{location}</Text>
        <Text style={styles.detail}>
          {city}, {country}
        </Text>
        <Text style={styles.detail}>
          {t("UserProfile.zipCode")}: {zipCode}
        </Text>
        <Text
          style={styles.descriptionText}
          numberOfLines={3}
          ellipsizeMode="tail"
        >
          {description}
        </Text>
      </View>
      <View style={styles.gymListContainer}>
        <Text style={styles.infoTitle}>{t("UserProfile.activitiesTitle")}</Text>
        {activities && (
          <FlatList
            data={activities.filter(
              (activity): activity is Activity => activity !== null
            )}
            renderItem={({ item }) => (
              <ActivityItemComponent
                activity={item}
                edit={!userId ? true : false}
                onShowActivity={() => {
                  showActivityHandler(
                    setShowActivityVisible,
                    setModalActivityId,
                    item.id,
                    showActivityVisible
                  );
                }}
                onActivityUpdate={() => {
                  activityUpdateHandler(
                    setActivityUpdatedCounter,
                    activityUpdatedCounter
                  );
                }}
              />
            )}
            keyExtractor={(item) => item.id}
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
            <Text style={styles.buttonText}>{t("UserProfile.editButton")}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              logout(setUser, navigation);
            }}
            style={[styles.button, styles.logoutButton]}
          >
            <Text style={styles.buttonText}>
              {t("UserProfile.logoutButton")}
            </Text>
          </TouchableOpacity>
        </View>
      )}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showActivityVisible}
        onRequestClose={() => {
          setShowActivityVisible(!showActivityVisible);
        }}
        presentationStyle="overFullScreen"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <TouchableOpacity
              style={styles.closeIconContainer}
              onPress={() => {
                setShowActivityVisible(false);
              }}
            >
              <SymbolView
                name="multiply"
                style={styles.closeIcon}
                type="monochrome"
                tintColor={"red"}
              />
            </TouchableOpacity>
            <ShowActivity
              onCloseModal={() => {
                showActivityVisibleHandler(
                  setShowActivityVisible,
                  showActivityVisible
                );
              }}
              activityId={modalActivityId}
              edit={!userId ? true : false}
              isRegistered={isRegistered ? isRegistered : false}
            ></ShowActivity>
          </View>
        </View>
      </Modal>
      <Modal visible={isEditing} animationType="fade" transparent={true}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>
              {t("UserProfile.editProfileTitle")}
            </Text>
            <View style={styles.row}>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>{t("UserProfile.gymName")}</Text>
                <TextInput
                  style={[styles.input, errors.gymName && styles.inputError]}
                  value={tempGymName}
                  onChangeText={(text) => {
                    setTempGymName(text);
                    setErrors({ ...errors, gymName: !text });
                  }}
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>{t("UserProfile.location")}</Text>
                <TextInput
                  style={[styles.input, errors.location && styles.inputError]}
                  value={tempLocation}
                  onChangeText={(text) => {
                    setTempLocation(text);
                    setErrors({ ...errors, location: !text });
                  }}
                />
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>{t("UserProfile.city")}</Text>
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
                <Text style={styles.label}>{t("UserProfile.country")}</Text>
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
                <Text style={styles.label}>{t("UserProfile.zipCode")}</Text>
                <TextInput
                  style={[styles.input, errors.zipCode && styles.inputError]}
                  value={tempZipCode}
                  onChangeText={(text) => {
                    setTempZipCode(text);
                    setErrors({ ...errors, zipCode: !text });
                  }}
                />
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>{t("UserProfile.description")}</Text>
                <TextInput
                  style={styles.textArea}
                  value={tempDescription}
                  onChangeText={setTempDescription}
                  multiline
                  numberOfLines={4}
                />
              </View>
            </View>

            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={handleCancelEdit}
              >
                <Text style={styles.buttonText}>
                  {t("UserProfile.cancelButton")}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSaveProfile}
              >
                <Text style={styles.buttonText}>
                  {t("UserProfile.saveButton")}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minWidth: "100%",
    backgroundColor: "white",
  },
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
  textArea: {
    backgroundColor: "#ffffff",
    borderRadius: 5,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    height: 120,
    textAlignVertical: "top",
    width: "100%",
    borderWidth: 1,
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
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginHorizontal: 5,
    borderRadius: 20,
    alignItems: "center",
    width: 150,
  },
  saveButton: {
    backgroundColor: "#dddddd",
  },
  cancelButton: {
    backgroundColor: "#dddddd",
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
    paddingHorizontal: 20,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
  },
  gymListContainer: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#000000",
    paddingHorizontal: 20,
    paddingVertical: 10,
    maxHeight: 370,
    height: "55%",
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
  descriptionContainer: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#000000",
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "red",
  },
  descriptionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 16,
    textAlign: "center",
    color: "#666666",
    marginTop: 10,
  },
  activitiesContainer: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#000000",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
    height: "10%",
    display: "flex",
    alignItems: "center",
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
    color: "black",
    fontWeight: "bold",
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
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

export default GymComponent;
