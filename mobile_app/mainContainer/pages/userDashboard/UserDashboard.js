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

const UserDashboard = () => {
  const navigation = useNavigation();

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
        <View style={styles.content}>{/* <Text>hello</Text> */}</View>
        {/* onPress={handleDetailsPress} */}
        <TouchableOpacity style={styles.signOut} onPress={handleDetailsPress}>
          <Text style={styles.text}>Sign Out</Text>
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
  },
  content: {
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
  signOut: {
    backgroundColor: "#dc143c",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: 200,
    height: 60,
    // backgroundColor: "white",
    borderRadius: 20,
    marginTop: 20,
    borderWidth: 1,
  },

  text: {
    color: "white",
    fontSize: 20,
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
