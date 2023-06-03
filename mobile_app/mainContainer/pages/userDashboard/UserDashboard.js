import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";

const UserDashboard = () => {
  const navigation = useNavigation();
  const userID = useSelector((state) => state.userID);

  const handleDetailsPress = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <Image
          source={require("../../../images/logo.png")}
          style={styles.icons}
        />
        <View style={styles.content}>
          <Image
            source={
              userID.User_Gender === "male"
                ? require("../../../images/male.png")
                : require("../../../images/female.png")
            }
            style={styles.profile}
          />
          <View style={styles.studentId}>
            <Text style={styles.text}>Student ID: </Text>
            <Text style={styles.text}>{userID.User_ID} </Text>
          </View>
          <View style={styles.studentInfo}>
            <Text style={styles.text}>Student Name: </Text>
            <Text style={styles.text}>{userID.Full_Name} </Text>
            <Text style={styles.text}>Student Gender:</Text>
            <Text style={styles.text}>{userID.User_Gender}</Text>
            <Text style={styles.text}>Student Status:</Text>
            <Text style={styles.text}>{userID.User_status}</Text>
          </View>
          <TouchableOpacity style={styles.edit} onPress={handleDetailsPress}>
            <Text style={styles.editText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.signOut} onPress={handleDetailsPress}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
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
    shadowOffset: { width: 2, height: 4 },
    shadowColor: "#171717",
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  content: {
    display: "flex",
    justifyContent: "start",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 20,
    marginTop: 20,
    borderWidth: 1,
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
  row: {
    display: "flex",
    flexDirection: "row",
  },

  signOut: {
    backgroundColor: "#dc143c",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: 300,
    height: 60,
    borderRadius: 20,
    marginTop: 20,
    borderWidth: 1,
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
    borderWidth: 1,
  },

  signOutText: {
    color: "white",
    fontSize: 25,
  },

  editText: {
    color: "black",
    fontSize: 25,
  },

  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 10,
  },
  icon: {
    marginTop: 20,
    width: 100,
  },

  inputLabel: {
    marginLeft: 3,
    fontSize: 20,
  },
  input: {
    fontSize: 20,
    width: 370,
    height: 35,
    marginVertical: 10,
    marginHorizontal: 5,
    borderBottomWidth: 2,
    borderColor: "#ccc",
  },

  button: {
    color: "black",
    width: 380,
    height: 60,
    backgroundColor: "#2b79ff",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
    marginTop: 20,
    shadowColor: "#171717",
    shadowOffset: { width: 3, height: 7 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  text: {
    fontSize: 23,
  },
  studentId: {
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    width: 300,
    height: 50,
    display: "flex",
    flexDirection: "row",
    backgroundColor: "#b0e0e6",
    marginTop: 10,
    fontSize: 23,
    borderWidth: 1,
  },
  studentInfo: {
    borderWidth: 1,
    borderRadius: 20,
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
  error: {
    fontSize: 17,
    marginTop: 10,
    textAlign: "center",
    color: "red",
  },
  buttonText: {
    fontSize: 23,
    fontWeight: "bold",
    color: "#fff",
  },
  signup: {
    position: "absolute",
    top: 640,
    fontSize: 15,
  },
  effect: {
    color: "blue",
  },
});

export default UserDashboard;
