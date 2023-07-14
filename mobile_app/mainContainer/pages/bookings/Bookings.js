import React, { useState, useEffect } from "react";
import {
  View,
  Text,
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
import CompletedBookingComponent from "./CompletedBookings";
import { useSelector } from "react-redux";

const Bookings = () => {
  const url = useSelector((state) => state.url);
  const User = useSelector((state) => state.userID);
  const [bookings, setBookings] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  let completedBookings = [];
  let currentBookings = [];

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
      .get(`${url}/api/bookings`)
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

  const update = () => {
    getData();
  };

  const CurrentUserBookings = bookings
    .filter((booking) => booking.studentID === User._id)
    .map((booking) => booking);

  CurrentUserBookings.forEach((booking) => {
    if (booking.status === "new") {
      currentBookings.push(booking);
    } else {
      completedBookings.push(booking);
    }
  });

  const bookingsData = archivedClicked
    ? completedBookings.map((booking) => (
        <CompletedBookingComponent info={booking} update={update} />
      ))
    : currentBookings.map((booking) => (
        <BookingComponent info={booking} update={update} />
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
    backgroundColor: "white",
    paddingTop: 30,
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
    height: "9%",
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
