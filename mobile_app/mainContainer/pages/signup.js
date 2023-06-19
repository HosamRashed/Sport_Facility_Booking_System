import React, { useState, useEffect } from "react";
import { SelectList } from "react-native-dropdown-select-list";
import axios from "axios";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const Signup = () => {
  const navigation = useNavigation();
  const initialize = {
    userID: "",
    name: "",
    gender: "",
    secretQuestion: "",
    answerQuestion: "",
    password: "",
    confirmPassword: "",
  };
  const [formData, setFormData] = useState(initialize);
  const [error, setError] = useState("");
  const [visible, setVisible] = useState(false);

  const question = [
    {
      value: "What is the name of your favorite childhood friend?",
    },
    { value: "What was your dream job as a child?" },
    { value: "What time off the day were you born?" },
  ];

  const handleInputChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleGenderChange = (value) => {
    setFormData({
      ...formData,
      gender: value,
    });
  };

  const handleSecretQuestion = (value) => {
    setFormData({
      ...formData,
      secretQuestion: value,
    });
  };

  const checkFields = (data) => {
    if (
      formData.password == "" ||
      formData.confirmPassword == "" ||
      formData.secretQuestion == "" ||
      formData.userID == "" ||
      formData.name == "" ||
      formData.answerQuestion == "" ||
      formData.gender == ""
    ) {
      setError("All inputs are required!");
      setVisible(true);
      return false;
    } else if (formData.userID.length !== 10) {
      setError("The length of USER ID should be exactly 10 numbers ");
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

  function submit() {
    setError("");
    if (checkFields()) {
      const url =
        "https://f04f-2001-e68-5456-acfd-186e-fb15-e26b-6ba1.ngrok-free.app/students/create";
      const data = {
        User_ID: formData.userID,
        Full_Name: formData.name,
        SecretQuestion: formData.secretQuestion,
        AnswerQuestion: formData.answerQuestion,
        Password: formData.password,
        ConfirmPassword: formData.confirmPassword,
        User_Gender: formData.gender,
      };
      axios
        .post(url, data)
        .then((res) => {
          if (res.status === 200) {
            if (res.data.message === "Duplicate") {
              setError(
                "The student with the provided ID number is already registered!"
              );
              setVisible(true);
            } else if (res.data.message === "successful") {
              console.log("successful");
              navigation.navigate("Login");
            }
          } else if (res.status === 500 || res.status === 501) {
            setError("Error creating a new student");
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
        <View>
          <Text style={styles.Label}>Registration Form </Text>
          <Text style={styles.inputLabel}>User ID: </Text>
          <TextInput
            keyboardType="numeric"
            style={styles.input}
            value={formData.userID}
            onChangeText={(value) => handleInputChange("userID", value)}
          />
        </View>

        <View>
          <Text style={styles.inputLabel}>Full Name: </Text>
          <TextInput
            style={styles.input}
            value={formData.name}
            onChangeText={(value) => handleInputChange("name", value)}
          />
        </View>

        <View style={styles.radioContainer}>
          <Text style={styles.radioLabel}>Gender:</Text>
          <TouchableOpacity
            style={[
              styles.radio,
              formData.gender === "male" && styles.radioSelected,
            ]}
            onPress={() => handleGenderChange("male")}
          >
            <Text
              style={[
                styles.radioText,
                formData.gender === "male" && styles.radioSelectedText,
              ]}
            >
              Male
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.radio,
              formData.gender === "female" && styles.radioSelected,
            ]}
            onPress={() => handleGenderChange("female")}
          >
            <Text
              style={[
                styles.radioText,
                formData.gender === "female" && styles.radioSelectedText,
              ]}
            >
              Female
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.selectList}>
          <SelectList
            style={styles.selectList}
            data={question}
            placeholder="Select a secret question"
            dropdownStyles={{
              maxWidth: 350,
              alignItems: "center",
              marginTop: 0,
              marginHorizontal: 25,
            }}
            setSelected={handleSecretQuestion}
            dropdownTextStyles={{ fontSize: 15 }}
            boxStyles={{ marginBottom: 15 }}
            inputStyles={{ fontSize: 15 }}
            search={false}
            maxHeight={150}
          />
        </View>
        <View>
          <Text style={styles.inputLabel}>Answer the secret question:</Text>
          <TextInput
            style={styles.input}
            value={formData.answerQuestion}
            onChangeText={(value) => handleInputChange("answerQuestion", value)}
          />
        </View>
        <View>
          <Text style={styles.inputLabel}>Password:</Text>
          <TextInput
            style={styles.input}
            secureTextEntry
            value={formData.password}
            onChangeText={(value) => handleInputChange("password", value)}
          />
        </View>
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
        <TouchableOpacity style={styles.button} onPress={submit}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
        {visible ? <Text style={styles.error}>{error}</Text> : ""}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    height: "100%",
    borderWidth: 1,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 10,
  },
  Label: {
    textAlign: "center",
    color: "#2b79ff",
    fontSize: 30,
    marginBottom: 20,
    fontWeight: "bold",
    shadowOffset: { width: 2, height: 5 },
    shadowColor: "#171717",
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  inputLabel: {
    marginLeft: 3,
    fontSize: 20,
  },
  selectList: {
    marginRight: 2,
    marginVertical: 5,
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
  radioContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  radioLabel: {
    marginRight: 48,
    fontSize: 20,
  },
  radio: {
    width: 100,
    height: 30,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "#2b79ff",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 9,
    marginVertical: 10,
  },
  radioText: {
    fontSize: 14,
  },
  radioSelected: {
    backgroundColor: "#2b79ff",
    borderColor: "blue",
  },
  radioSelectedText: {
    color: "#fff",
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

export default Signup;
