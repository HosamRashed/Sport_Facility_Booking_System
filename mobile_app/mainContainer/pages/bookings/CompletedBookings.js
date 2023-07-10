import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  Modal,
} from "react-native";
import axios from "axios";
import { connect } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";

const CompletedBookingComponent = (props) => {
  const url = useSelector((state) => state.url);
  const navigation = useNavigation();
  const { info, userID } = props;
  const [facility, setFacility] = useState(null);
  const [rating, setRating] = useState(info.rating);

  const handleStarPress = (selectedRating) => {
    setRating(selectedRating);

  
    if (selectedRating !== info.rating) {
      const config = {
        method: "PUT",
        url: `${url}/facilities/updateRating/${info.facilityID}`,
        data: {
          userID: info.studentID,
          rating: selectedRating,
        },
      };
      axios(config)
        .then((response) => {
          console.log("Rating has been updated successfully!");
          updateBooking(selectedRating);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const updateBooking = (selectedRating) => {
    if (selectedRating !== info.rating) {
      const config = {
        method: "PUT",
        url: `${url}/bookings/${info._id}`,
        data: {
          ratingStar: selectedRating,
        },
      };
      axios(config)
        .then((response) => {
          console.log("booking has been updated successfully!");
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    axios
      .get(`${url}/facilities/${info.facilityID}`)
      .then((response) => {
        setFacility(response.data.data);
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  let bookedCalender;
  let bookedSlot;
  if (facility && facility.calendar && info.slotDay && info.slot_ID) {
    const calenders = facility.calendar;
    bookedCalender = calenders.find(
      (calendar) => calendar.day === info.slotDay
    );
    if (bookedCalender) {
      bookedSlot = bookedCalender.slots.find(
        (slot) => slot._id === info.slot_ID
      );
    }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        {bookedSlot ? (
          <>
            <Text style={styles.inputLabel}>
              {facility.name} {"  "} {bookedCalender.day}
              {"\n"} {"\n"}
              {bookedSlot.time[0] === 12
                ? bookedSlot.time[0] + " pm"
                : bookedSlot.time[0] > 12
                ? bookedSlot.time[0] - 12 + " pm"
                : bookedSlot.time[0] + " am"}{" "}
              -{" "}
              {bookedSlot.time[1] === 12
                ? bookedSlot.time[1] + " pm"
                : bookedSlot.time[1] > 12
                ? bookedSlot.time[1] - 12 + " pm"
                : bookedSlot.time[1] + " am"}{" "}
              {"  "} {bookedCalender.date}
            </Text>

            <View style={styles.starContainer}>
              <TouchableOpacity onPress={() => handleStarPress(1)}>
                <Ionicons
                  name={rating >= 1 ? "star" : "star-outline"}
                  size={27}
                  color={rating >= 1 ? "gold" : "black"}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleStarPress(2)}>
                <Ionicons
                  name={rating >= 2 ? "star" : "star-outline"}
                  size={27}
                  color={rating >= 2 ? "gold" : "black"}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleStarPress(3)}>
                <Ionicons
                  name={rating >= 3 ? "star" : "star-outline"}
                  size={27}
                  color={rating >= 3 ? "gold" : "black"}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleStarPress(4)}>
                <Ionicons
                  name={rating >= 4 ? "star" : "star-outline"}
                  size={27}
                  color={rating >= 4 ? "gold" : "black"}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleStarPress(5)}>
                <Ionicons
                  name={rating >= 5 ? "star" : "star-outline"}
                  size={27}
                  color={rating >= 5 ? "gold" : "black"}
                />
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <Text style={styles.inputLabel}></Text>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    margin: 10,
    width: 370,
    borderRadius: 10,
    paddingHorizontal: 25,
    paddingVertical: 2,
    height: 100,
    display: "flex",
    justifyContent: "start",
    marginTop: 10,
    alignItems: "flex-start",
    shadowOffset: { width: -2, height: 4 },
    shadowColor: "#171717",
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  inputLabel: {
    marginTop: 10,
    marginLeft: 3,
    fontSize: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  editButton: {
    position: "absolute",
    top: 50,
    right: 50,
    backgroundColor: "#2089dc",
    padding: 8,
    borderRadius: 5,
    marginRight: 10,
    shadowOffset: { width: 0, height: 0 },
    shadowColor: "#171717",
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },

  deleteButton: {
    position: "absolute",
    top: 50,
    right: 15,
    backgroundColor: "#ff0000",
    padding: 8,
    borderRadius: 5,
    shadowOffset: { width: 0, height: 0 },
    shadowColor: "#171717",
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },

  DoneButton: {
    position: "absolute",
    top: 50,
    right: 105,
    backgroundColor: "#1EC233",
    padding: 8,
    borderRadius: 5,
    shadowOffset: { width: 0, height: 0 },
    shadowColor: "#171717",
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },

  modalContainer: {
    flex: 1,
    marginLeft: "auto",
    marginRight: "auto",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    width: "100%",
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  insideContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    borderRadius: 20,
    backgroundColor: "white",
  },
  modalText: {
    textAlign: "center",
    fontSize: 20,
    marginBottom: 10,
    color: "black",
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  confirmButton: {
    borderRadius: 30,
    backgroundColor: "green",
  },
  cancelButton: {
    borderRadius: 30,
    backgroundColor: "red",
  },
  OkButton: {
    borderRadius: 30,
    // backgroundColor: "red",
  },
  OkbuttonText: {
    color: "black",
    fontSize: 16,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  starContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
    position: "absolute",
    top: 50,
    right: 10,
  },
});

const mapStateToProps = (state) => {
  return {
    userID: state.userID,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateBooking: (bookingDetails) => {
      dispatch({ type: "UPDATE_BOOKING", payload: bookingDetails });
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CompletedBookingComponent);
