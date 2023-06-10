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
import axios from "axios";
import AnnounceComponent from "./AnnounceComponent";

const Announcement = () => {
  const [announcement, setAnnouncement] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  let validAnnouncements = [];
  let archivedAnnouncements = [];
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
        "https://0662-2001-e68-5456-21-d5ba-a7c2-799a-ca2c.ngrok-free.app/api/announcements"
      )
      .then((response) => {
        setAnnouncement(response.data.data);
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

  const today = new Date();
  announcement.forEach((announce) => {
    const announcementDate = new Date(announce.date);
    const timeDiff = Math.abs(today.getTime() - announcementDate.getTime());
    const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    if (diffDays > 30) {
      archivedAnnouncements.push(announce);
    } else {
      validAnnouncements.push(announce);
    }
  });

  const announcements = validClicked
    ? validAnnouncements.map((announcement, index) => (
        <AnnounceComponent key={index} info={announcement} />
      ))
    : archivedAnnouncements.map((announcement, index) => (
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
            <Text style={styles.text}>Archived</Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          style={styles.scrollContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
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
    paddingHorizontal: 30,
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
    shadowOffset: { width: 0, height: 0 },
    shadowColor: "#171717",
    shadowOpacity: 0.3,
    shadowRadius: 3,
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
