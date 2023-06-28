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
  ScrollView,
  RefreshControl,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import FacilityComponeent from "./FacilityComponeent";

const Facility = () => {
  const [facility, setFacilities] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  // const []
  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    axios
      .get(
        "https://62ec-2001-e68-5456-198-c858-14b9-931b-aefb.ngrok-free.app/api/facility"
      )
      .then((response) => {
        setFacilities(response.data.data);
      })
      .catch((error) => {
        console.log("error", error);
      })
      .finally(() => {
        setRefreshing(false);
      });
  };

  const onRefresh = () => {
    setRefreshing(true);
    getData();
  };

  // console.log(facility);
  const facilities = facility.map((facility, index) => (
    <FacilityComponeent key={index} info={facility} />
  ));
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <Image
          source={require("../../../images/logo.png")}
          style={styles.icons}
        />
        <ScrollView
          style={styles.scrollContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View style={styles.facilityContainer}>{facilities}</View>
        </ScrollView>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    display: "flex",
    justifyContent: "start",
    alignItems: "center",
    height: "100%",
    paddingHorizontal: 10,
    backgroundColor: "#f5deb3 ",
  },

  icons: {
    height: "8%",
    width: 100,
  },

  facilityContainer: {
    marginTop: 10,
  },

  title: {
    fontFamily: "NunitoSans_10pt-Bold",
    fontSize: 30,

    textAlign: "center",
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

export default Facility;
