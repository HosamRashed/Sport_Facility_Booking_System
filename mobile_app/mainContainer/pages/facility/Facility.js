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
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import FacilityComponeent from "./FacilityComponeent";

const facility = () => {
  // const [facility, setFacilities] = useState({});
  // useEffect(() => {
  //   getData();
  // }, []);
  // const getData = () => {
  //   axios
  //     .get("http://169.254.114.126:3000/api/facility")
  //     .then((response) => {
  //       setFacilities(response.data.data);
  //       console.log("hello");
  //       console.log(facility[0].name);
  //       // setIsLoading(false); // Set isLoading to false when data is fetched
  //     })
  //     .catch((error) => {
  //       console.log("error", error);
  //     });
  // };
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        {/* <Text style={styles.inputLabel}>hello </Text> */}
        <View style={styles.facilityContainer}>
          <FacilityComponeent />
          <FacilityComponeent />
          <FacilityComponeent />
          <FacilityComponeent />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingtop: 20,

    display: "flex",
    justifyContent: "start",
    alignItems: "center",
    height: "100%",
    paddingHorizontal: 40,
    borderWidth: 2,
  },
  facilityContainer: {
    borderWidth: 2,
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

export default facility;
