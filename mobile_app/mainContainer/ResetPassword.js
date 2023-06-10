import React, { useState, useEffect } from "react";
import axios from "axios";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const ResetPassword = () => {
  const navigation = useNavigation();
  const initialize = {
    userID: "",
    answerQuestion: "",
    password: "",
    confirmPassword: "",
  };
  const [formData, setFormData] = useState(initialize);
  const [error, setError] = useState("");
  const [visible, setVisible] = useState(false);
  const [verified, setVerified] = useState(false);

  const handleInputChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const checkFields = (data) => {
    if (formData.userID == "" || formData.answerQuestion == "") {
      setError("All inputs are required!");
      setVisible(true);
      return false;
    } else if (formData.userID.length !== 10) {
      setError("The length of USER ID should be exactly 10 numbers ");
      setVisible(true);
      return false;
    } else {
      return true;
    }
  };

  const checkPasswords = (data) => {
    if (formData.password == "" || formData.confirmPassword == "") {
      setError("All inputs are required!");
      setVisible(true);
      return false;
    } else if (formData.password !== formData.confirmPassword) {
      setError("Passowrds should be identicial!");
      setVisible(true);
      return false;
    } else if (formData.password.length < 6) {
      setError("The passowrd should be more than 6 characters");
      setVisible(true);
      return false;
    } else {
      return true;
    }
  };

  function update() {
    if (checkPasswords()) {
      const url =
        "https://0662-2001-e68-5456-21-d5ba-a7c2-799a-ca2c.ngrok-free.app/students/updatePassword";
      const data = {
        User_ID: formData.userID,
        Password: formData.password,
        ConfirmPassword: formData.confirmPassword,
      };
      axios
        .post(url, data)
        .then((res) => {
          if (res.status === 200) {
            if (res.data.message === "Password updated successfully") {
              console.log("successful");
              setVerified(true);
              setError("");
              setVisible(false);
              navigation.navigate("Login");
            } else {
              setError(res.data.message);
              setVisible(true);
            }
          } else if (res.status === 400) {
            setError(res.data.message);
            setVisible(true);
          }
        })
        .catch((error) => {
          setError(error.response.data.message);
          setVisible(true);
          console.log(error);
        });
    }
  }

  function submit() {
    if (checkFields()) {
      const url =
        "https://0662-2001-e68-5456-21-d5ba-a7c2-799a-ca2c.ngrok-free.app/students/resetPassword";
      const data = {
        User_ID: formData.userID,
        AnswerQuestion: formData.answerQuestion,
      };
      axios
        .post(url, data)
        .then((res) => {
          console.log("successful");
          if (res.data.message === "Successful") {
            console.log("successful");
            setVerified(true);
            setError("");
            setVisible(false);
          } else {
            setError(res.data.message);
            setVisible(true);
          }
        })
        .catch((error) => {
          setError(error.response.data.message);
          setVisible(true);
          console.log(error);
        });
    }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <Image source={require("../images/logo.png")} style={styles.icon} />
        {!verified ? (
          <View>
            <Text style={styles.inputLabel}>User ID: </Text>
            <TextInput
              keyboardType="numeric"
              style={styles.input}
              value={formData.userID}
              onChangeText={(value) => handleInputChange("userID", value)}
            />
          </View>
        ) : (
          <View>
            <Text style={styles.inputLabel}>New Password: </Text>
            <TextInput
              style={styles.input}
              secureTextEntry
              value={formData.password}
              onChangeText={(value) => handleInputChange("password", value)}
            />
          </View>
        )}

        {!verified ? (
          <View>
            <Text style={styles.inputLabel}>Answer the secret question:</Text>
            <TextInput
              style={styles.input}
              value={formData.answerQuestion}
              onChangeText={(value) =>
                handleInputChange("answerQuestion", value)
              }
            />
          </View>
        ) : (
          <View>
            <Text style={styles.inputLabel}>Confirm Password:</Text>
            <TextInput
              style={styles.input}
              secureTextEntry
              value={formData.confirmPassword}
              onChangeText={(value) =>
                handleInputChange("confirmPassword", value)
              }
            />
          </View>
        )}
        {!verified ? (
          <TouchableOpacity style={styles.button} onPress={submit}>
            <Text style={styles.buttonText}>Check Information</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.update} onPress={update}>
            <Text style={styles.buttonText}>Update Password</Text>
          </TouchableOpacity>
        )}
        {visible ? <Text style={styles.error}>{error}</Text> : ""}
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
    marginTop: 120,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 10,
  },
  inputLabel: {
    marginLeft: 3,
    marginTop: 10,
    fontSize: 20,
  },
  selectList: {
    marginTop: 25,
    marginRight: 2,
    marginVertical: 20,
    width: 360,
  },
  selectLabel: {
    marginBottom: 10,
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
  icon: {
    position: "absolute",
    top: -20,
    width: 100,
  },
  button: {
    color: "black",
    width: 300,
    height: 50,
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
  update: {
    color: "black",
    width: 300,
    height: 50,
    backgroundColor: "green",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
    marginTop: 20,
    shadowColor: "#171717",
    shadowOffset: { width: 3, height: 7 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  error: {
    textAlign: "center",
    color: "red",
    marginTop: 10,
  },
});

export default ResetPassword;
