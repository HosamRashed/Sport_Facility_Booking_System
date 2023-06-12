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

const Bookings = () => {
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
        "https://4f5b-2001-e68-7000-1-9888-d524-2691-9d4a.ngrok-free.app/api/bookings"
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

  // const today = new Date();
  // announcement.forEach((announce) => {
  //   const announcementDate = new Date(announce.date);
  //   const timeDiff = Math.abs(today.getTime() - announcementDate.getTime());
  //   const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
  //   if (diffDays > 30) {
  //     archivedAnnouncements.push(announce);
  //   } else {
  //     validAnnouncements.push(announce);
  //   }
  // });

  // const announcements = validClicked
  //   ? validAnnouncements.map((announcement, index) => (
  //       <AnnounceComponent key={index} info={announcement} />
  //     ))
  //   : archivedAnnouncements.map((announcement, index) => (
  //       <AnnounceComponent key={index} info={announcement} />
  //     ));

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
            <Text style={styles.text}>Upcoming Bookings</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.bookText,
              archivedClicked && { backgroundColor: "#b0e0e6" },
            ]}
            onPress={handleArchivedClick}
          >
            <Text style={styles.text}>Completed Bookings</Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          style={styles.scrollContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {/* <View style={styles.announcementContainer}>{announcements}</View> */}
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
    paddingHorizontal: 0,
    marginTop: 20,
    display: "flex",
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    // borderWidth: 1,
  },

  bookText: {
    width: 180,
    backgroundColor: "white",
    borderRadius: 50,
    shadowOffset: { width: 0, height: 0 },
    shadowColor: "#171717",
    shadowOpacity: 0.3,
    shadowRadius: 3,
    paddingVertical: 10,
    // paddingHorizontal: ,
  },

  text: {
    width: 180,
    fontSize: 17,
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

export default Bookings;
