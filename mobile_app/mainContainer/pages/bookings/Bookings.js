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
import BookingComponent from "./BookingComponent";

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
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
    console.log("retrieve");
    axios
      .get(
        "https://62ec-2001-e68-5456-198-c858-14b9-931b-aefb.ngrok-free.app/api/bookings"
      )
      .then((response) => {
        setBookings(response.data.data);
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

  const onDelete = () => {
    getData();
  };

  const bookingsData = bookings.map((booking, index) => (
    <View key={index}>
      <BookingComponent info={booking} onDelete={onDelete} />
    </View>
  ));

  return (
    <View style={styles.container}>
      <Image
        source={require("../../../images/logo.png")}
        style={styles.icons}
      />
      <TouchableWithoutFeedback
        contentContainerStyle={styles.scrollViewContent}
        onPress={Keyboard.dismiss}
        accessible={false}
      >
        <View style={styles.scrollContainer}>
          <ScrollView
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
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

            <View style={styles.announcementContainer}>{bookingsData}</View>
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
    </View>
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
    position: "fixed",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  icons: {
    height: "8%",
    width: 100,
  },
  announcementContainer: {
    marginTop: 10,
  },
  buttons: {
    paddingHorizontal: 0,
    marginTop: 20,
    display: "flex",
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
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
