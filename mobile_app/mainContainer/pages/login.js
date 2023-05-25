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
import axios from "axios";

const Login = () => {
  const initialize = {
    userID: "",
    password: "",
  };
  const [formData, setFormData] = useState(initialize);
  const [error, setError] = useState({});
  const [visible, setVisible] = useState(false);

  const navigation = useNavigation();

  const handleInputChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const checkInputs = () => {
    if (formData.password == "" || formData.userID == "") {
      setError("All inputs are required!");
      setVisible(true);
      return false;
    } else if (formData.userID.length !== 10) {
      setError("The length of USER ID should 10 be exactly numbers ");
      setVisible(true);
      return false;
    }
    return true;
  };

  function submit() {
    if (checkInputs()) {
      const url = "http://169.254.114.126:3000/students/login";
      const data = {
        User_ID: formData.userID,
        Password: formData.password,
      };
      console.log(data, url);

      fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((res) => {
          console.log(res);
          if (res.message === "Login Successful") {
            console.log("successful");
            navigation.navigate("mainPage");
          } else {
            setError(res.message);
            setVisible(true);
          }
        })
        .catch((error) => {
          setError(error.message);
          setVisible(true);
          console.log(error);
        });
    }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <Image source={require("../../images/logo.png")} style={styles.icon} />

        <View>
          <TextInput
            keyboardType="numeric"
            style={styles.input}
            placeholder="User ID"
            value={formData.userID}
            onChangeText={(value) => handleInputChange("userID", value)}
          />
        </View>

        <View>
          <TextInput
            style={styles.input}
            secureTextEntry
            placeholder="Password"
            value={formData.password}
            onChangeText={(value) => handleInputChange("password", value)}
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={submit}>
          <Text style={styles.buttonText}>Log in</Text>
        </TouchableOpacity>
        <Text
          onPress={() => {
            setError("");
            navigation.navigate("resetPassword");
          }}
          style={styles.forget}
        >
          Forget Password?{" "}
        </Text>

        {visible ? <Text style={styles.error}>{error}</Text> : ""}

        <Text style={styles.signup}>
          Don't have an account?{" "}
          <Text
            style={styles.effect}
            onPress={() => {
              setError("");
              navigation.navigate("signup");
            }}
          >
            Sign Up
          </Text>
        </Text>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    paddingTop: 170,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 10,
  },
  icon: {
    position: "absolute",
    top: 130,
    width: 100,
  },

  inputLabel: {
    marginLeft: 3,
    fontSize: 20,
  },
  input: {
    color: "black",
    fontSize: 23,
    width: 370,
    height: 35,
    marginVertical: 20,
    marginHorizontal: 2,
    borderBottomWidth: 1,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderColor: "gray",
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
  forget: {
    position: "absolute",
    top: 580,
    left: 30,
    fontSize: 15,
    color: "blue",
  },
  error: {
    fontSize: 17,
    position: "absolute",
    top: 610,
    left: "auto",
    right: "auto",
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
    top: 700,
    fontSize: 15,
  },
  effect: {
    color: "blue",
  },
});

export default Login;
