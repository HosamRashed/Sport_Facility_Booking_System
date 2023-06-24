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

let newFacility;
const BookingComponent = (props) => {
  const { info, userID, onDelete } = props;
  const [facility, setFacility] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showEditConfirmation, setShowEditConfirmation] = useState(false);

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    axios
      .get(
        `https://f04f-2001-e68-5456-acfd-186e-fb15-e26b-6ba1.ngrok-free.app/facilities/${info.facility}`
      )
      .then((response) => {
        setFacility(response.data.data);
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  let bookedCalender;
  let bookedSlot;
  if (facility && facility.calender && info.day && info.slot_ID) {
    const calenders = facility.calender;
    bookedCalender = calenders.find((calender) => calender.day === info.day);
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
    console.log("delete");
    const updatedFacility = { ...facility };
    const updatedCalender = [...updatedFacility.calender];

    const calenderIndex = updatedCalender.findIndex(
      (calender) => calender.day === bookedCalender.day
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

        updatedFacility.calender = updatedCalender;

        const mainObject = { ...updatedFacility };
        newFacility = mainObject;

        setFacility(mainObject);
        updateBookings();
      }
    }
  };

  const updateBookings = () => {
    const config = {
      method: "DELETE",
      url: `https://f04f-2001-e68-5456-acfd-186e-fb15-e26b-6ba1.ngrok-free.app/bookings/delete/${info._id}`,
    };
    axios(config)
      .then((response) => {
        console.log("The booking is deleted");
        updateDatabase();
        onDelete();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const updateDatabase = () => {
    const config = {
      method: "PUT",
      url: `https://f04f-2001-e68-5456-acfd-186e-fb15-e26b-6ba1.ngrok-free.app/facilities/update/${info.facility}`,
      data: {
        calender: newFacility.calender,
      },
    };

    axios(config)
      .then((response) => {
        console.log("facility's calender has been updated successfully!");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleEdit = () => {
    setShowEditConfirmation(true);
  };

  const confirmEdit = () => {
    console.log("confrim");
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
            <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
              <Ionicons name="create" size={20} color="white" />
            </TouchableOpacity>
          </>
        ) : (
          <Text style={styles.inputLabel}>Slot not available</Text>
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

        <TouchableOpacity style={styles.deleteButton} onPress={handleEdit}>
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