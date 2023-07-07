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
import axios from "axios";
import { useSelector } from "react-redux";

let calenderIndex;
let newFacility;

const BookDetails = (props) => {
  const url = useSelector((state) => state.url);
  const route = useRoute();
  const navigation = useNavigation();

  const { userID } = props;

  const { info, returnToBooking } = route.params;
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
      const calendarDay =
        facility.calendar && facility.calendar.find((item) => item.day == day);
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
              {calendarDay.day} {"\n"} {calendarDay.date}
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
              {calendarDay.day} {"\n"} {calendarDay.date}
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

  const generateSlots = (calendar) => {
    return calendar.slots.map((slot, index) => {
      let type = "";
      if (slot.type === "female") type = "female";
      else if (slot.type === "male") type = "male";
      else if (slot.type === "mixed") type = "mixed";
      else if (slot.type === "") type = "booked";
      return (
        <TouchableOpacity onPress={() => checkSelection(slot)} key={index}>
          <View style={[styles.slot, styles[type + "Background"]]}>
            <Text style={styles.slotText}>
              {slot.time[0] === 12
                ? slot.time[0] + " pm"
                : slot.time[0] > 12
                ? slot.time[0] - 12 + " pm"
                : slot.time[0] + " am"}{" "}
              -{" "}
              {slot.time[1] === 12
                ? slot.time[1] + " pm"
                : slot.time[1] > 12
                ? slot.time[1] - 12 + " pm"
                : slot.time[1] + " am"}
            </Text>
          </View>
        </TouchableOpacity>
      );
    });
  };

  const handleDaySelectedClick = (index) => {
    setselectedDay(index);
    let calendar;

    for (let i = 0; i < facility.calendar.length; i++) {
      if (facility.calendar[i].day == index) {
        calendar = facility.calendar[i];
        calenderIndex = i;
        break;
      }
    }

    if (calendar) {
      setSlots(generateSlots(calendar));
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
      const updatedFacility = { ...facility };
      const updatedCalender = [...updatedFacility.calendar];

      const selectedDayCalender = { ...updatedCalender[calenderIndex] };
      const updatedSlots = [...selectedDayCalender.slots];

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
          userID: userID.User_ID,
          prevType: selectedSlot.type,
        };

        selectedDayCalender.slots = updatedSlots;

        updatedCalender[calenderIndex] = selectedDayCalender;

        updatedFacility.calendar = updatedCalender;

        // Save the updated facility object to the main facility object
        const mainObject = { ...updatedFacility };

        // Close the confirmation modal and send updated calendar to the backend
        newFacility = mainObject;
        setShowConfirmation(false);
        updateBookings(newFacility);
      }
    }
  };

  const updateDatabase = (Facility) => {
    console.log(Facility.calendar);
    console.log(Facility._id);

    const config = {
      method: "PUT",
      url: `${url}/facilities/update/${Facility._id}`,
      data: {
        calendar: Facility.calendar,
      },
    };

    axios(config)
      .then((response) => {
        console.log("facility's calendar has been updated successfully!");
        returnToBooking
          ? navigation.navigate("Bookings")
          : navigation.navigate("FacilityInfo", { facility: Facility });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const updateBookings = (newFacility) => {
    const config = {
      method: "POST",
      url: `${url}/bookings/create`,
      data: {
        studentID: userID._id,
        facilityID: facility._id,
        studentName: userID.Full_Name,
        facilityName: facility.name,
        slot_ID: selectedSlot._id,
        slotTime: selectedSlot.time,
        slotDate: newFacility.calendar[calenderIndex].date,
        slotDay: newFacility.calendar[calenderIndex].day,
      },
    };
    axios(config)
      .then((response) => {
        console.log("booking is added to the database!");
        updateDatabase(newFacility);
      })
      .catch((error) => {
        console.log(error);
      });
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
              {selectedDay ? (
                <TouchableOpacity
                  style={[
                    styles.button,
                    slotSelected && { backgroundColor: "#90ee90" },
                  ]}
                  onPress={handleSlotClick}
                >
                  <Text style={styles.text}>Select a slot</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={[
                    styles.button,
                    slotSelected && { backgroundColor: "#90ee90" },
                  ]}
                >
                  <Text style={styles.text}>Select a slot</Text>
                </TouchableOpacity>
              )}
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
                {selectedSlot?.time && selectedSlot.time[0] === 12
                  ? selectedSlot.time[0] + " pm"
                  : selectedSlot?.time?.[0] > 12
                  ? selectedSlot.time[0] - 12 + " pm"
                  : selectedSlot?.time?.[0] + " am"}{" "}
                -{" "}
                {selectedSlot?.time && selectedSlot.time[1] === 12
                  ? selectedSlot.time[1] + " pm"
                  : selectedSlot?.time?.[1] > 12
                  ? selectedSlot.time[1] - 12 + " pm"
                  : selectedSlot?.time?.[1] + " am"}
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
    backgroundColor: "white",
    height: "100%",
    paddingTop: 40,
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
    shadowOpacity: 0.3,
    shadowRadius: 10,
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
    backgroundColor: "#EAA048",
    borderRadius: 5,
  },
  mixedBackground: {
    backgroundColor: "#EAA048",
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
