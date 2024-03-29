import React, { useState, useEffect } from "react";
import {
  View,
  Text,
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
import LottieView from "lottie-react-native";
import successAnimation from "../../../assets/animation/blueDone.json"; 

let newFacility;
let delteOrEditIndicator;
const BookingComponent = (props) => {
  const url = useSelector((state) => state.url);
  const navigation = useNavigation();
  const { info, userID, update } = props;
  const [facility, setFacility] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showEditConfirmation, setShowEditConfirmation] = useState(false);
  const [showDoneConfirmation, setshowDoneConfirmation] = useState(false);
  const [showErrorDoneConfirmation, setshowErrorDoneConfirmation] =
    useState(false);
  const [showSuccessfullConfirmation, setshowSuccessfullConfirmation] =
    useState(false);

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

  const handleDelete = () => {
    setShowConfirmation(true);
  };

  const confirmDelete = () => {
    setShowConfirmation(false); 

    // update facility timetable
    const updatedFacility = { ...facility };
    const updatedCalender = [...updatedFacility.calendar];

    const calenderIndex = updatedCalender.findIndex(
      (calendar) => calendar.day === bookedCalender.day
    );

    if (calenderIndex !== -1) {
      const selectedDayCalender = { ...updatedCalender[calenderIndex] };
      const updatedSlots = [...selectedDayCalender.slots];

      const selectedSlotIndex = updatedSlots.findIndex(
        (slot) => slot._id === bookedSlot._id
      );

      if (selectedSlotIndex !== -1) {
        updatedSlots[selectedSlotIndex] = {
          ...bookedSlot,
          availability: "available",
          type: bookedSlot.prevType,
          userID: null,
          prevType: null,
        };

        selectedDayCalender.slots = updatedSlots;

        updatedCalender[calenderIndex] = selectedDayCalender;

        updatedFacility.calendar = updatedCalender;

        const mainObject = { ...updatedFacility };
        newFacility = mainObject;

        setFacility(mainObject);
        delteOrEditIndicator = 0;
        updateBookings();
      }
    }
  };

  const updateBookings = () => {
    const config = {
      method: "DELETE",
      url: `${url}/bookings/delete/${info._id}`,
    };
    axios(config)
      .then((response) => {
        delteOrEditIndicator == 0 ? updateDatabase() : updateDatabaseEdit();
        update();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const updateDatabase = () => {
    const calendarConfig = {
      method: "PUT",
      url: `${url}/facilities/update/${info.facilityID}`,
      data: {
        calendar: newFacility.calendar,
      },
    };

    axios(calendarConfig)
      .then((response) => {
        console.log("facility's calendar has been updated successfully!");
      })
      .catch((error) => {
        console.log(error);
      });

    const calendarReservation = {
      method: "DELETE",
      url: `${url}/facility/deleteReservation/${info.facilityID}/${info.studentID}`,
    };
    axios(calendarReservation)
      .then((response) => {
        console.log("facility's calendar has been updated successfully!");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const updateDatabaseEdit = () => {
    const config = {
      method: "PUT",
      url: `${url}/facilities/update/${info.facilityID}`,
      data: {
        calendar: newFacility.calendar,
      },
    };

    axios(config)
      .then((response) => {
        console.log("facility's calendar has been updated successfully!");
        navigation.navigate("BookDetails", {
          info: newFacility,
          returnToBooking: true,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleEdit = () => {
    setShowEditConfirmation(true);
  };

  const confirmEdit = () => {
    setShowEditConfirmation(false);
    
    // update facility timetable
    const updatedFacility = { ...facility };
    const updatedCalender = [...updatedFacility.calendar];
    const calenderIndex = updatedCalender.findIndex(
      (calendar) => calendar.day === bookedCalender.day
    );

    if (calenderIndex !== -1) {
      const selectedDayCalender = { ...updatedCalender[calenderIndex] };
      const updatedSlots = [...selectedDayCalender.slots];

      const selectedSlotIndex = updatedSlots.findIndex(
        (slot) => slot._id === bookedSlot._id
      );

      if (selectedSlotIndex !== -1) {
        updatedSlots[selectedSlotIndex] = {
          ...bookedSlot,
          availability: "available",
          type: bookedSlot.prevType,
          userID: null,
          prevType: null,
        };

        selectedDayCalender.slots = updatedSlots;

        updatedCalender[calenderIndex] = selectedDayCalender;

        updatedFacility.calendar = updatedCalender;

        const mainObject = { ...updatedFacility };
        newFacility = mainObject;

        // update the current facility object
        setFacility(mainObject);
        delteOrEditIndicator = 1;
        updateBookings();
      }
    }
  };
  
  const checkBookingTime = () => {
    const currentDateTime = new Date();
    const currentDay = currentDateTime.getDate();
    const currentMonth = currentDateTime.getMonth() + 1;
    const currenthour = currentDateTime.getHours();

    const [bookedDay, bookedMonth] = info.slotDate.split("/").map(Number);
    const [bookedStartTime, bookedEndTime] = bookedSlot.time;

    if (
      currentDay === bookedDay &&
      currentMonth === bookedMonth &&
      currenthour >= bookedStartTime &&
      currenthour <= bookedEndTime
    ) {
      return true;
    }
    return false;
  };

  const handleDone = () => {
    if (checkBookingTime()) setshowDoneConfirmation(true);
    else {
      setshowErrorDoneConfirmation(true);
      setTimeout(() => {
        setshowErrorDoneConfirmation(false);
      }, 1500);
    }
  };

  const confirmDone = () => {
    setshowDoneConfirmation(false);

    const config = {
      method: "PUT",
      url: `${url}/bookings/status/${info._id}`,
      data: {
        status: "successfull",
      },
    };
    axios(config)
      .then((response) => {
        setshowSuccessfullConfirmation(true);
        setTimeout(() => {
          setshowSuccessfullConfirmation(false);
          update();
        }, 2500);
      })
      .catch((error) => {
        console.log(error);
      });
  };

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
          </>
        ) : (
          <Text style={styles.inputLabel}></Text>
        )}

        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Ionicons name="trash" size={20} color="white" />
          <Modal
            visible={showConfirmation}
            animationType="fade"
            transparent={true}
          >
            <View style={styles.modalContainer}>
              <View style={styles.insideContainer}>
                <Text style={styles.modalText}>
                  Are you sure you want {"\n"}to delete this booking?
                </Text>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={[styles.button, styles.confirmButton]}
                    onPress={confirmDelete}
                  >
                    <Text style={styles.buttonText}>Confirm</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.button, styles.cancelButton]}
                    onPress={() => setShowConfirmation(false)}
                  >
                    <Text style={styles.buttonText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </TouchableOpacity>

        <TouchableOpacity style={styles.DoneButton} onPress={handleDone}>
          <Ionicons name="checkmark-done" size={20} color="white" />
            <Modal
              visible={showDoneConfirmation}
              animationType="fade"
              transparent={true}
            >
              <View style={styles.modalContainer}>
                <View style={styles.insideContainer}>
                  <Text style={styles.modalText}>
                    Are you sure you want to mark this booking as attended?
                  </Text>
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity
                      style={[styles.button, styles.confirmButton]}
                      onPress={confirmDone}
                    >
                      <Text style={styles.buttonText}>Confirm</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.button, styles.cancelButton]}
                      onPress={() => setshowDoneConfirmation(false)}
                    >
                      <Text style={styles.buttonText}>Cancel</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>

          <Modal
            visible={showErrorDoneConfirmation}
            animationType="fade"
            transparent={true}
          >
            <View style={styles.modalContainer}>
              <View style={styles.insideContainer}>
                <Text style={styles.modalText}>
                  The booked time slot does not match the current time.
                </Text>
              </View>
            </View>
          </Modal>

          <Modal
            visible={showSuccessfullConfirmation}
            animationType="fade"
            transparent={true}
          >
            <View style={styles.animationModalContainer}>
              <View style={styles.animationContainer}>
                <LottieView
                  source={successAnimation}
                  autoPlay
                  loop={false}
                  style={styles.animation}
                />
              </View>
            </View>
          </Modal>
        </TouchableOpacity>

        <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
          <Ionicons name="create" size={20} color="white" />
          <Modal
            visible={showEditConfirmation}
            animationType="fade"
            transparent={true}
          >
            <View style={styles.modalContainer}>
              <View style={styles.insideContainer}>
                <Text style={styles.modalText}>
                  Are you sure you want {"\n"}to change your booking slot?
                </Text>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={[styles.button, styles.confirmButton]}
                    onPress={confirmEdit}
                  >
                    <Text style={styles.buttonText}>Confirm</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.button, styles.cancelButton]}
                    onPress={() => setShowEditConfirmation(false)}
                  >
                    <Text style={styles.buttonText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </TouchableOpacity>
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
  animationModalContainer: {
    flex: 1,
    marginLeft: "auto",
    marginRight: "auto",
    width: "100%",
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  animationContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    borderRadius: 20,
  },
  animation: {
    width: 250,
    height: 250,
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

export default connect(mapStateToProps, mapDispatchToProps)(BookingComponent);
