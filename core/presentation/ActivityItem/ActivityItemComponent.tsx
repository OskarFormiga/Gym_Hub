import React, { useState } from "react";
import { Text, View, TouchableOpacity, Modal, StyleSheet } from "react-native";
import { removeActivity } from "./ActivityItemPresenter";
import { Activity } from "../../../interfaces/interfaces";
import { SymbolView } from "expo-symbols";
import { useTranslation } from "react-i18next"; // Import useTranslation hook

interface ActivityComponentProps {
  activity: Activity | null;
  onActivityUpdate: any;
  onShowActivity: any;
  edit?: any;
}

const ActivityItemComponent = (prop: ActivityComponentProps) => {
  const { t } = useTranslation(); // useTranslation hook
  const [modalVisible, setModalVisible] = useState(false);

  if (!prop || !prop.activity) return null;
  return (
    <TouchableOpacity
      onPress={() => {
        prop.onShowActivity(prop.activity?.id);
      }}
      style={styles.container1}
    >
      <View style={styles.container2}>
        <SymbolView
          name="dumbbell.fill"
          style={styles.symbol5}
          type="monochrome"
          tintColor={"black"}
        />
      </View>
      <View style={styles.container3}>
        <Text
          style={styles.sessionTitle}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {prop.activity.name}
        </Text>
        {prop.edit && (
          <TouchableOpacity
            onPress={() => {
              setModalVisible(true);
            }}
          >
            <SymbolView
              name="trash"
              style={styles.symbol}
              type="monochrome"
              tintColor={"black"}
            />
          </TouchableOpacity>
        )}
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
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>
              {t("ActivityItemComponent.deleteConfirmation")}
            </Text>

            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>
                  {t("ActivityItemComponent.cancelButton")}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={() => {
                  if (!!prop && !!prop.activity) {
                    removeActivity(prop.activity.id, prop.onActivityUpdate);
                  }
                  setModalVisible(false);
                }}
              >
                <Text style={styles.buttonText}>
                  {t("ActivityItemComponent.confirmButton")}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container1: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 5,
    borderRadius: 10,
    width: "100%",
    height: 60,
    marginBottom: 10,
  },
  container2: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "20%",
    height: "100%",
  },
  container3: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "80%",
    height: "100%",
  },
  symbol3: {
    width: 17,
    height: 17,
    margin: 5,
  },
  symbol5: {
    width: 40,
    height: 30,
    margin: 5,
  },
  sessionTitle: {
    fontSize: 16,
    color: "#000000",
    fontWeight: "bold",
    paddingHorizontal: 5,
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
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
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
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
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
  },
  sessionsInfo: {
    borderTopWidth: 1,
    borderColor: "#000000",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  modalText: {
    fontSize: 18,
    color: "#000000",
    marginBottom: 10,
    textAlign: "center",
    lineHeight: 22,
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
    backgroundColor: "#A2A2A2",
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
    backgroundColor: "#bbbbbb",
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 10,
  },
  symbol: {
    width: 30,
    height: 30,
    margin: 5,
  },
  symbol2: {
    width: 35,
    height: 25,
    margin: 5,
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
  },
  buttonContainer2: {
    flexDirection: "row",
    alignItems: "center",
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
    width: 100,
  },
  editButton: {
    backgroundColor: "#4CAF50",
  },
  logoutButton: {
    backgroundColor: "#F44336",
  },
  buttonText: {
    color: "#000000",
    fontWeight: "bold",
    fontSize: 14,
  },
});

export default ActivityItemComponent;
