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
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import AnnounceComponent from "./AnnounceComponent";
// import FacilityInfo from "./FacilityInfo";

const Announcement = () => {
  const [announcement, setAnnouncement] = useState([]);
  const [validClicked, setValidClicked] = useState(true);
  const [archivedClicked, setArchivedClicked] = useState(false);

  const handleValidClick = () => {
    setValidClicked(true);
    setArchivedClicked(false);
  };

  const handleArchivedClick = () => {
    setValidClicked(false);
    setArchivedClicked(true);
  };

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    axios
      .get(
        "https://f532-2001-e68-5456-1e2e-b58b-4e3d-5cec-439e.ngrok-free.app/api/announcements"
      )
      .then((response) => {
        setAnnouncement(response.data.data);
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  const announcements = announcement.map((announcement, index) => (
    <AnnounceComponent key={index} info={announcement} />
  ));
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <Image
          source={require("../../../images/logo.png")}
          style={styles.icons}
        />
        <View style={styles.buttons}>
          <TouchableOpacity
            style={[
              styles.bookText,
              validClicked && { backgroundColor: "#b0e0e6" },
            ]}
            onPress={handleValidClick}
          >
            <Text style={styles.text}>Valid</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.bookText,
              archivedClicked && { backgroundColor: "#b0e0e6" },
            ]}
            onPress={handleArchivedClick}
          >
            <Text style={styles.text}>Archieved</Text>
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.scrollContainer}>
          <View style={styles.announcementContainer}>{announcements}</View>
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
  },
  scrollContainer: {
    // borderWidth: 1,
    // flex: 1,
    marginTop: 10,
  },

  icons: {
    height: "8%",
    width: 100,
  },

  announcementContainer: {
    marginTop: 10,
  },

  title: {
    fontFamily: "NunitoSans_10pt-Bold",
    fontSize: 30,
    // fontWeight: "bold",
    // marginBottom: 10,
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

  buttons: {
    paddingHorizontal: 40,
    marginTop: 20,
    display: "flex",
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    // borderWidth: 1,
  },

  bookText: {
    width: 150,
    backgroundColor: "white",
    borderRadius: 50,
    borderWidth: 1,
    padding: 10,
    paddingHorizontal: 30,
  },

  text: {
    fontSize: 20,
    textAlign: "center",
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

export default Announcement;
