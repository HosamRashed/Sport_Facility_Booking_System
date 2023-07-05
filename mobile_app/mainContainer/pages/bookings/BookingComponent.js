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

let newFacility;
let delteOrEditIndicator;
const BookingComponent = (props) => {
  const url = useSelector((state) => state.url);
  const navigation = useNavigation();
  const { info, userID, onDelete } = props;
  const [facility, setFacility] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showEditConfirmation, setShowEditConfirmation] = useState(false);
  const [showDoneConfirmation, setshowDoneConfirmation] = useState(false);
  const [showErrorDoneConfirmation, setshowErrorDoneConfirmation] =
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
    setShowConfirmation(false); // Hide the confirmation pop-up
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
        console.log("The booking is deleted");
        delteOrEditIndicator == 0 ? updateDatabase() : updateDatabaseEdit();
        onDelete();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const updateDatabase = () => {
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
        delteOrEditIndicator = 1;
        updateBookings();
      }
    }
  };
  const checkBookingTime = () => {
    const currentDateTime = new Date(); // Get the current date and time
    const currentDay = currentDateTime.getDate();
    const currentMonth = currentDateTime.getMonth() + 1; // Adding 1 because getMonth() returns zero-based index
    const [bookedDay, bookedMonth] = info.slotDate.split("/").map(Number);

    if (currentDay === bookedDay && currentMonth === bookedMonth) {
      console.log("Booking is on the correct date. Accepted.");
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
    setShowConfirmation(false); // Hide the confirmation pop-up
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
