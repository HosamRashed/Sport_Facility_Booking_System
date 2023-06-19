import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
  Modal,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import axios from "axios";

const UserDashboard = () => {
  const [visible, setVisible] = useState(false);
  const [editedProfile, setEditedProfile] = useState(null);
  const navigation = useNavigation();
  const User = useSelector((state) => state.userID);
  const [currentStudentInfo, setCurrentStudentInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    axios
      .get(
        `https://f04f-2001-e68-5456-acfd-186e-fb15-e26b-6ba1.ngrok-free.app/api/students/${User._id}`
      )
      .then((response) => {
        setCurrentStudentInfo(response.data.data[0]);
      })
      .catch((error) => {
        console.log("error", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleDetailsPress = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
  };

  const handleEditProfile = () => {
    setVisible(true);
    setEditedProfile({
      Full_Name: currentStudentInfo.Full_Name,
      User_Gender: currentStudentInfo.User_Gender,
      AnswerQuestion: currentStudentInfo.AnswerQuestion,
    });
  };

  const handleSubmitProfile = () => {
    console.log(editedProfile);
    const config = {
      method: "PUT",
      url: `https://f04f-2001-e68-5456-acfd-186e-fb15-e26b-6ba1.ngrok-free.app/students/update/${User._id}`,
      data: {
        Full_Name: editedProfile.Full_Name,
        AnswerQuestion: editedProfile.AnswerQuestion,
        User_Gender: editedProfile.User_Gender,
      },
    };

    axios(config)
      .then((response) => {
        console.log("Student information updated successfully!", response.data);
        getData();
      })
      .catch((error) => {
        console.log(error);
      });
    setVisible(false);
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        setVisible(false);
      }}
      accessible={false}
    >
      <View style={styles.container}>
        <Image
          source={require("../../../images/logo.png")}
          style={styles.icons}
        />
        <View style={styles.content}>
          <View
            style={[
              styles.status,
              currentStudentInfo.User_status == "active"
                ? { backgroundColor: "#90ee90" }
                : { backgroundColor: "#dc143c", color: "white" },
            ]}
          >
            <Text
              style={[
                styles.text,
                currentStudentInfo.User_status == "active"
                  ? { color: "black" }
                  : { color: "white" },
              ]}
            >
              {currentStudentInfo.User_status}
            </Text>
          </View>
          <Image
            source={
              currentStudentInfo.User_Gender === "male"
                ? require("../../../images/male.png")
                : require("../../../images/female.png")
            }
            style={styles.profile}
          />
          <View style={styles.studentId}>
            <Text style={styles.text}>Student ID:</Text>
            <Text style={styles.text}>{currentStudentInfo.User_ID}</Text>
          </View>
          <View style={styles.studentInfo}>
            <Text style={styles.text}>Student Name:</Text>
            <Text style={styles.text}>{currentStudentInfo.Full_Name}</Text>
            <Text style={styles.text}>Student Gender:</Text>
            <Text style={styles.text}>{currentStudentInfo.User_Gender}</Text>
          </View>
          <TouchableOpacity style={styles.edit} onPress={handleEditProfile}>
            <Text style={styles.editText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.signOut} onPress={handleDetailsPress}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>

        <Modal visible={visible} transparent={true} animationType="fade">
          <TouchableWithoutFeedback
            onPress={() => setVisible(false)}
            accessible={false}
          >
            <View style={styles.modalContainer}>
              <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>Edit Profile</Text>
                  <Text style={styles.ModalText}>Name : </Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Full Name"
                    value={editedProfile?.Full_Name}
                    onChangeText={(value) =>
                      setEditedProfile({ ...editedProfile, Full_Name: value })
                    }
                  />
                  <Text style={styles.ModalText}>Secret Answer :</Text>

                  <TextInput
                    style={styles.input}
                    placeholder="Answer"
                    value={editedProfile?.AnswerQuestion}
                    onChangeText={(value) =>
                      setEditedProfile({
                        ...editedProfile,
                        AnswerQuestion: value,
                      })
                    }
                  />

                  <TouchableOpacity
                    style={styles.radioOption}
                    onPress={() =>
                      setEditedProfile({
                        ...editedProfile,
                        User_Gender: "male",
                      })
                    }
                  >
                    <Text style={styles.radioText}>Male</Text>
                    {editedProfile?.User_Gender === "male" && (
                      <View style={styles.radioSelected} />
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.radioOption}
                    onPress={() =>
                      setEditedProfile({
                        ...editedProfile,
                        User_Gender: "female",
                      })
                    }
                  >
                    <Text style={styles.radioText}>Female</Text>
                    {editedProfile?.User_Gender === "female" && (
                      <View style={styles.radioSelected} />
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.saveButton}
                    onPress={handleSubmitProfile}
                  >
                    <Text style={styles.saveButtonText}>Update</Text>
                  </TouchableOpacity>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
    height: "100%",
    shadowOffset: { width: 0, height: 0 },
    shadowColor: "#171717",
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  content: {
    display: "flex",
    justifyContent: "start",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 20,
    marginTop: 20,
    width: 350,
    height: 500,
  },
  icons: {
    height: "8%",
    width: 100,
  },
  profile: {
    marginTop: 20,
    height: "23%",
    width: 100,
  },

  status: {
    shadowOffset: { width: 0, height: 0 },
    shadowColor: "#171717",
    shadowOpacity: 0.5,
    shadowRadius: 3,
    paddingHorizontal: 10,
    padding: 5,
    borderRadius: 10,
    position: "absolute",
    top: 15,
    right: 15,
  },

  signOut: {
    backgroundColor: "#dc143c",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: 300,
    height: 60,
    borderRadius: 10,
    marginTop: 20,
  },
  edit: {
    position: "absolute",
    bottom: 20,
    right: "auto",
    left: "auto",
    backgroundColor: "#90ee90",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: 200,
    height: 40,
    borderRadius: 10,
    shadowOffset: { width: 0, height: 0 },
    shadowColor: "#171717",
    shadowOpacity: 0.5,
    shadowRadius: 3,
  },
  signOutText: {
    color: "white",
    fontSize: 25,
  },
  editText: {
    color: "black",
    fontSize: 25,
  },
  icon: {
    marginTop: 20,
    width: 100,
  },

  ModalText: {
    fontSize: 17,
    marginBottom: 10,
  },

  text: {
    fontSize: 20,
  },

  studentId: {
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    width: 300,
    height: 50,
    display: "flex",
    flexDirection: "row",
    backgroundColor: "#b0e0e6",
    marginTop: 10,
    fontSize: 23,
  },
  studentInfo: {
    paddingHorizontal: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    width: 300,
    height: 200,
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#b0e0e6",
    marginTop: 20,
    fontSize: 23,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    width: 330,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  modallabel: {
    marginLeft: 3,
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "start",
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  saveButton: {
    shadowOffset: { width: 2, height: 4 },
    shadowColor: "#171717",
    shadowOpacity: 0.2,
    shadowRadius: 3,
    backgroundColor: "#90ee90",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
  },
  saveButtonText: {
    color: "black",
    fontSize: 18,
  },
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  radioText: {
    marginLeft: 10,
    fontSize: 16,
  },
  radioSelected: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    backgroundColor: "#90ee90",
    borderColor: "#90ee90",
    marginLeft: 10,
  },
  selectList: {
    marginRight: 2,
    marginVertical: 5,
    width: 360,
  },
});

export default UserDashboard;
