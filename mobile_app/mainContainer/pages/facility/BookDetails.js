import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  Modal,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import { connect } from "react-redux";

let calenderIndex;
let newFacility;

const BookDetails = (props) => {
  const route = useRoute();
  const navigation = useNavigation();

  const { userID } = props;

  const { info } = route.params;
  const [facility, setFacility] = useState(info);

  const [daySelected, setDaySelected] = useState(true);
  const [slotSelected, setSlotSelected] = useState(false);
  const [selectedDay, setselectedDay] = useState(null);
  const [selectedSlot, setselectedSlot] = useState({});
  const [slots, setSlots] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showGenderMismatchModal, setShowGenderMismatchModal] = useState(false);
  const [showBookedModal, setShowBookedModal] = useState(false);

  const sortedDays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const days = sortedDays
    .filter((day) => facility.selectedDays.includes(day))
    .map((day, index) => {
      if (facility.selectedDays.length - 1 === index && index % 2 === 0) {
        return (
          <TouchableOpacity
            style={[
              styles.lastDay,
              selectedDay === day && { backgroundColor: "#2471A3" },
            ]}
            key={index}
            onPress={() => handleDaySelectedClick(day)}
          >
            <Text
              style={[
                styles.dayText,
                selectedDay === day && { color: "white" },
              ]}
            >
              {day}
            </Text>
          </TouchableOpacity>
        );
      } else {
        return (
          <TouchableOpacity
            style={[
              styles.day,
              selectedDay === day && { backgroundColor: "#2471A3" },
            ]}
            key={index}
            onPress={() => handleDaySelectedClick(day)}
          >
            <Text
              style={[
                styles.dayText,
                selectedDay === day && { color: "white" },
              ]}
            >
              {day}
            </Text>
          </TouchableOpacity>
        );
      }
    });

  const handleDayClick = () => {
    setDaySelected(true);
    setSlotSelected(false);
  };

  const handleSlotClick = () => {
    setDaySelected(false);
    setSlotSelected(true);
  };

  const generateSlots = (calender) => {
    return calender.slots.map((slot, index) => {
      let type = "";
      if (slot.type === "female") type = "female";
      else if (slot.type === "male") type = "male";
      else if (slot.type === "mixed") type = "mixed";
      else if (slot.type === "") type = "booked";
      return (
        <TouchableOpacity onPress={() => checkSelection(slot)} key={index}>
          <View style={[styles.slot, styles[type + "Background"]]}>
            <Text style={styles.slotText}>
              From {slot.time[0]} To {slot.time[1]}
            </Text>
          </View>
        </TouchableOpacity>
      );
    });
  };

  const handleDaySelectedClick = (index) => {
    setselectedDay(index);
    let calender;

    for (let i = 0; i < facility.calender.length; i++) {
      if (facility.calender[i].day == index) {
        calender = facility.calender[i];
        calenderIndex = i;
        break;
      }
    }

    if (calender) {
      setSlots(generateSlots(calender)); // Assuming you have a state variable 'slots' to store the generated slots
    }

    setDaySelected(false);
    setSlotSelected(true);
  };

  const checkSelection = (slot) => {
    if (slot.availability === "booked") {
      setShowBookedModal(true);
    } else if (slot.type === "female" && userID.User_Gender !== "female") {
      setShowGenderMismatchModal(true);
    } else if (slot.type === "male" && userID.User_Gender !== "male") {
      setShowGenderMismatchModal(true);
    } else {
      showConfirmationDialog(slot);
    }
  };

  const showConfirmationDialog = (slot) => {
    setselectedSlot(slot);
    setShowConfirmation(true);
  };

  const handleBookSlot = () => {
    if (calenderIndex !== undefined && selectedSlot !== null) {
      const updatedFacility = { ...facility }; // Create a copy of the facility object
      const updatedCalender = [...updatedFacility.calender]; // Create a copy of the calender array

      const selectedDayCalender = { ...updatedCalender[calenderIndex] }; // Get the selected day's calender object
      const updatedSlots = [...selectedDayCalender.slots]; // Create a copy of the slots array

      // Find the index of the selected slot in the slots array
      const selectedSlotIndex = updatedSlots.findIndex(
        (slot) => slot.time[0] === selectedSlot.time[0]
      );

      // Update the availability of the selected slot to "booked"
      if (selectedSlotIndex !== -1) {
        updatedSlots[selectedSlotIndex] = {
          ...selectedSlot,
          availability: "booked",
          type: "",
        };

        // Update the slots array in the selected day's calender object
        selectedDayCalender.slots = updatedSlots;

        // Update the calender array in the facility object
        updatedCalender[calenderIndex] = selectedDayCalender;

        // Update the facility object with the updated calender
        updatedFacility.calender = updatedCalender;

        // Save the updated facility object to the main object
        // (Replace 'mainObject' with the appropriate state or variable that holds the main facility object)
        const mainObject = { ...updatedFacility };

        // Close the confirmation modal and update the state
        console.log(mainObject);
        newFacility = mainObject;
        setShowConfirmation(false);
        navigatation();
      }
    }
  };

  const navigatation = () => {
    // console.log(newFacility);
    navigation.navigate("FacilityInfo", { facility: newFacility });
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        scrollEnabled={false}
      >
        <View style={styles.container}>
          <View style={styles.buttons}>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[
                  styles.button,
                  daySelected && { backgroundColor: "#90ee90" },
                ]}
                onPress={handleDayClick}
              >
                <Text style={styles.text}>Select a day</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.button,
                  slotSelected && { backgroundColor: "#90ee90" },
                ]}
                onPress={handleSlotClick}
              >
                <Text style={styles.text}>Select a slot</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.contentContainer}>
            {daySelected ? (
              days
            ) : (
              <>
                <View style={styles.indicator}>
                  <View style={styles.maleContainer}>
                    <View style={styles.males}></View>
                    <Text style={styles.indicatorText}> Male</Text>
                  </View>
                  <View style={styles.femaleContainer}>
                    <View style={styles.females}></View>
                    <Text style={styles.indicatorText}> Female</Text>
                  </View>

                  <View style={styles.bookedContainer}>
                    <View style={styles.booked}></View>
                    <Text style={styles.indicatorText}> Booked</Text>
                  </View>

                  <View style={styles.mixedContainer}>
                    <View style={styles.mixed}></View>
                    <Text style={styles.indicatorText}> Mixed</Text>
                  </View>
                </View>
                <View style={styles.slotsContaienr}>
                  <ScrollView
                    style={styles.scroll}
                    showsVerticalScrollIndicator={false}
                  >
                    {slots}
                  </ScrollView>
                </View>
              </>
            )}
          </View>
        </View>
        <Modal
          visible={showConfirmation}
          animationType="fade"
          transparent={true}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Confirm Booking</Text>
              <Text style={styles.modalText}>
                Are you sure you want to book this slot:
              </Text>
              <Text style={styles.modalSlotText}>
                <Text style={styles.modalSlotText}>
                  {selectedSlot && selectedSlot.time && selectedSlot.time[0]} -{" "}
                  {selectedSlot && selectedSlot.time && selectedSlot.time[1]}
                </Text>
              </Text>
              <View style={styles.modalButtonsContainer}>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={() => setShowConfirmation(false)}
                >
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalButtonConfirm]}
                  onPress={handleBookSlot}
                >
                  <Text
                    style={[
                      styles.modalButtonText,
                      styles.modalButtonTextConfirm,
                    ]}
                  >
                    Book
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <Modal
          visible={showGenderMismatchModal}
          animationType="fade"
          transparent={true}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>-- Error --</Text>
              <Text style={styles.modalText}>
                You are not allowed to book this slot due to gender
                restrictions.{" "}
              </Text>

              <View style={styles.modalButtonsContainer}>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={() => setShowGenderMismatchModal(false)}
                >
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <Modal
          visible={showBookedModal}
          animationType="fade"
          transparent={true}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>-- Error --</Text>
              <Text style={styles.modalText}>
                This slot has already been booked.
              </Text>

              <View style={styles.modalButtonsContainer}>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={() => setShowBookedModal(false)}
                >
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },

  buttons: {
    width: "100%",
    height: 120,
    flexDirection: "column",
    justifyContent: "start",
    alignItems: "center",
    marginRight: 10,
    justifyContent: "center",
  },
  buttonContainer: {
    flexDirection: "column",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    backgroundColor: "white",
    color: "white",
    marginHorizontal: "auto",
    marginBottom: 15,
    borderRadius: 20,
    width: "100%",
    height: 50,
    shadowOffset: { width: 0, height: 0 },
    shadowColor: "#171717",
    shadowOpacity: 0.3,
    shadowRadius: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 22,
    textAlign: "center",
  },
  contentContainer: {
    shadowOffset: { width: 0, height: 0 },
    shadowColor: "#171717",
    shadowOpacity: 0.5,
    shadowRadius: 3,
    backgroundColor: "white",
    paddingTop: 10,
    flexDirection: "row",
    flexWrap: "wrap",
    width: "100%",
    height: 500,
    marginTop: 20,
    paddingHorizontal: 10,
    paddingVertical: 10,
    justifyContent: "center",
    borderRadius: 10,
  },
  day: {
    backgroundColor: "white",
    marginRight: 10,
    marginBottom: 10,
    borderRadius: 20,
    width: "45%",
    height: 100,
    shadowOffset: { width: 0, height: 0 },
    shadowColor: "#171717",
    shadowOpacity: 0.3,
    shadowRadius: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  lastDay: {
    backgroundColor: "white",
    marginRight: 10,
    marginBottom: 10,
    borderRadius: 20,
    width: "90%",
    height: 100,
    shadowOffset: { width: 0, height: 0 },
    shadowColor: "#171717",
    shadowOpacity: 0.3,
    shadowRadius: 3,
    alignItems: "center",
    justifyContent: "center",
  },

  dayText: {
    fontSize: 18,
    textAlign: "center",
  },
  indicator: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    height: 63,
    backgroundColor: "white",
    borderRadius: 20,
    flexWrap: "wrap",
    alignItems: "center",
  },
  femaleContainer: {
    marginTop: 10,
    width: "30%",
    alignContent: "center",
    justifyContent: "center",
    display: "flex",
    flexDirection: "row",
  },
  females: {
    width: 20,
    height: 20,
    backgroundColor: "#FD83CA",
    borderRadius: 5,
  },
  femaleBackground: {
    backgroundColor: "#FD83CA",
  },
  mixedContainer: {
    paddingRight: 10,
    marginTop: 10,
    width: "30%",
    alignContent: "center",
    justifyContent: "center",
    display: "flex",
    flexDirection: "row",
  },
  mixed: {
    width: 20,
    height: 20,
    backgroundColor: "#E3F261",
    borderRadius: 5,
  },
  mixedBackground: {
    backgroundColor: "#E3F261",
  },
  maleContainer: {
    marginTop: 10,
    width: "30%",
    alignContent: "center",
    justifyContent: "center",
    display: "flex",
    flexDirection: "row",
  },
  males: {
    width: 20,
    height: 20,
    backgroundColor: "#5DADE2",
    borderRadius: 5,
  },
  maleBackground: {
    backgroundColor: "#5DADE2",
  },
  bookedContainer: {
    marginTop: 10,
    width: "30%",
    alignContent: "center",
    justifyContent: "center",
    display: "flex",
    flexDirection: "row",
  },
  booked: {
    width: 20,
    height: 20,
    backgroundColor: "#CD4237",
    borderRadius: 5,
  },
  bookedBackground: {
    backgroundColor: "#CD4237",
  },
  indicatorText: {
    fontSize: 15,
  },

  slotsContaienr: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    height: "80%",
    backgroundColor: "white",
    shadowRadius: 3,
    flexWrap: "wrap",
    alignItems: "center",
  },
  slot: {
    backgroundColor: "white",
    marginRight: 10,
    marginBottom: 10,
    borderRadius: 20,
    width: "100%",
    height: 100,
    shadowOffset: { width: 0, height: 0 },
    shadowColor: "#171717",
    shadowOpacity: 0.3,
    shadowRadius: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  slotText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 20,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
  scroll: {
    padding: 20,
    borderRadius: 10,
    width: "100%",
  },

  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 20,
    elevation: 5,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalText: {
    textAlign: "center",
    fontSize: 16,
    marginBottom: 10,
  },
  modalSlotText: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 20,
  },
  modalButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "70%",
  },
  modalButton: {
    borderRadius: 30,
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
  },
  modalButtonConfirm: {
    backgroundColor: "#2471A3",
  },
  modalButtonText: {
    fontWeight: "bold",
    color: "#333333",
  },
  modalButtonTextConfirm: {
    color: "white",
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

export default connect(mapStateToProps, mapDispatchToProps)(BookDetails);