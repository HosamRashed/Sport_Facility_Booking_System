import React, { useState } from "react";
import axios from "axios";
import Navbar from "../../../Navbar/Navbar";
import Cookies from "universal-cookie";
import "./TimeTable.css";
import Slot from "./Slot/Slot";
import Swal from "sweetalert2";
import { useParams } from "react-router-dom";

export default function TimeTable() {
  const initialize = {
    availableFrom: "",
    availableTo: "",
    duration: "",
    selectedDays: [],
    calender: [],
  };

  const daysOfWeek = [
    "saturday",
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
  ];

  const params = useParams();
  const [form, setForm] = useState(initialize);
  const [error, setError] = useState("");
  const [visible, setVisible] = useState(false);
  let slots;
  const [content, setContent] = useState(false);
  const cookies = new Cookies();
  const token = cookies.get("TOKEN");

  const checkInputs = () => {
    if (
      form.availableFrom === "" ||
      form.availableTo === "" ||
      form.duration === "" ||
      form.selectedDays.length === 0
    ) {
      setError("All inputs are required!");
      setVisible(true);
      return false;
    } else if (Number(form.availableFrom) >= Number(form.availableTo)) {
      setError("The Start Time should be less than the End Time");
      setVisible(true);
      return false;
    }
    setError("");
    setVisible(false);
    return true;
  };

  const slotsDivide = () => {
    const numberOfSlots =
      (parseInt(form.availableTo) - parseInt(form.availableFrom)) /
      form.duration;
    let startTime = parseInt(form.availableFrom);
    const availableSlots = [];

    for (let i = 0; i < numberOfSlots; i++) {
      if (form.duration === "2") {
        availableSlots.push({
          time: [startTime, startTime + 2],
          availability: "available",
          type: "",
        });
        startTime = startTime + 2;
      } else if (form.duration === "1") {
        availableSlots.push({
          time: [startTime, startTime + 1],
          availability: "available",
          type: "",
        });
        startTime = startTime + 1;
      }
    }

    return availableSlots;
  };

  const getCurrentDayInfo = function () {
    const today = new Date();

    const options = { weekday: "long" };
    const dayName = today.toLocaleDateString("en-US", options);

    const date = today.getDate();
    const month = today.getMonth() + 1;

    return [dayName, date, month];
  };

  const findDayIndex = function (currentDay) {
    return daysOfWeek.findIndex(
      (day) => day.toLowerCase() === currentDay.toLowerCase()
    );
  };

  const findDifference = function (today, selectedDay) {
    const todayIndex = findDayIndex(today.toLowerCase());
    const selectedDayIndex = findDayIndex(selectedDay.toLowerCase());

    if (todayIndex === -1 || selectedDayIndex === -1) {
      console.error("Invalid day entered!");
      return -1;
    }

    if (todayIndex === selectedDayIndex) {
      return 0;
    } else if (selectedDayIndex > todayIndex) {
      return selectedDayIndex - todayIndex;
    } else {
      return daysOfWeek.length - Math.abs(selectedDayIndex - todayIndex);
    }
  };

  const prepareContent = () => {
    slots = slotsDivide();
    const [TodayName, date, month] = getCurrentDayInfo();
    const days = form.selectedDays
      .map((selectedDay) => {
        const differenceDays = findDifference(TodayName, selectedDay);
        if (differenceDays === -1) {
          return null;
        } else if (differenceDays === 0) {
          return {
            date: `${date}/${month}`,
            day: selectedDay,
            slots,
          };
        } else {
          const selectedDate = date + differenceDays;
          const formattedDate =
            selectedDate < 10 ? `0${selectedDate}` : selectedDate;
          return {
            date: `${formattedDate}/${month}`,
            day: selectedDay,
            slots,
          };
        }
      })
      .filter((day) => day !== null);

    form.calender = days;
    setContent(true);
  };

  const handleNext = (event) => {
    event.preventDefault();
    if (checkInputs()) {
      prepareContent();
    }
  };

  const update = (event) => {
    event.preventDefault();
    setContent(false);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleDaysChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setForm((prevData) => ({
        ...prevData,
        selectedDays: [...prevData.selectedDays, value],
      }));
    } else {
      setForm((prevData) => ({
        ...prevData,
        selectedDays: prevData.selectedDays.filter((day) => day !== value),
      }));
    }
  };

  const handleSlotTypeChange = (time, type) => {
    const updatedCalender = form.calender.map((day) => {
      const updatedSlots = day.slots.map((slot) => {
        if (slot.time === time) {
          if (type === "booked") {
            return { ...slot, availability: "booked", type: "" };
          } else {
            return { ...slot, type, availability: "available" };
          }
        }
        return slot;
      });

      return { ...day, slots: updatedSlots };
    });

    setForm((prevData) => ({
      ...prevData,
      calender: updatedCalender,
    }));
  };

  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    backgroundColor: "green",
    timer: 3000,
    timerProgressBar: true,
  });

  const alert = () => {
    Toast.fire({
      title: "Facility's calander is updated successfully",
      background: "#18a146",
      color: "white",
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(form);
    const config = {
      method: "PUT",

      url: `http://localhost:3000/facility/${params.id}/timeTable`,
      data: {
        availableFrom: form.availableFrom,
        availableTo: form.availableTo,
        duration: form.duration,
        selectedDays: form.selectedDays,
        calendar: form.calender,
      },
    };
    axios(config)
      .then((response) => {
        alert();
        setTimeout(() => {
          window.location.href = "/facility";
        }, 3000);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      {token ? (
        !content ? (
          <div className="MainContainer">
            <Navbar />
            <div className="formContainer">
              <form onSubmit={handleSubmit} className="options">
                <div className="facilityTiming">
                  <select
                    id="availableFrom"
                    name="availableFrom"
                    value={form.availableFrom}
                    onChange={handleChange}
                  >
                    <option value="">-- available From --</option>
                    <option value="8.00">8.00 AM</option>
                    <option value="10.00">10.00 AM</option>
                    <option value="12.00">12.00 AM</option>
                    <option value="14.00">14.00 PM</option>
                    <option value="16.00">16.00 PM</option>
                    <option value="18.00">18.00 PM</option>
                  </select>

                  <select
                    id="type"
                    name="availableTo"
                    value={form.availableTo}
                    onChange={handleChange}
                  >
                    <option value="">-- available To --</option>
                    <option value="10.00">10.00 AM</option>
                    <option value="12.00">12.00 AM</option>
                    <option value="14.00">14.00 PM</option>
                    <option value="16.00">16.00 PM</option>
                    <option value="18.00">18.00 PM</option>
                    <option value="20.00">20.00 PM</option>
                  </select>

                  <select
                    id="duration"
                    name="duration"
                    value={form.duration}
                    onChange={handleChange}
                  >
                    <option value="">-- Book Duration: --</option>
                    <option value="1">1 hour</option>
                    <option value="2">2 hours</option>
                  </select>
                </div>

                <div className="daysContainer">
                  <p id="dayslabel">Available Days</p>
                  <div className="days">
                    <label className="check-label">
                      <input
                        className="check"
                        type="checkbox"
                        name="days"
                        value="Monday"
                        checked={form.selectedDays.includes("Monday")}
                        onChange={handleDaysChange}
                      />
                      <span className="checkmark"></span>
                      Monday
                    </label>
                    <label className="check-label">
                      <input
                        className="check"
                        type="checkbox"
                        name="days"
                        value="Tuesday"
                        checked={form.selectedDays.includes("Tuesday")}
                        onChange={handleDaysChange}
                      />
                      <span className="checkmark"></span>
                      Tuesday
                    </label>
                    <label className="check-label">
                      <input
                        className="check"
                        type="checkbox"
                        name="days"
                        value="Wednesday"
                        checked={form.selectedDays.includes("Wednesday")}
                        onChange={handleDaysChange}
                      />
                      <span className="checkmark"></span>
                      Wednesday
                    </label>
                    <label className="check-label">
                      <input
                        className="check"
                        type="checkbox"
                        name="days"
                        value="Thursday"
                        checked={form.selectedDays.includes("Thursday")}
                        onChange={handleDaysChange}
                      />
                      <span className="checkmark"></span>
                      Thursday
                    </label>
                    <label className="check-label">
                      <input
                        className="check"
                        type="checkbox"
                        name="days"
                        value="Friday"
                        checked={form.selectedDays.includes("Friday")}
                        onChange={handleDaysChange}
                      />
                      <span className="checkmark"></span>
                      Friday
                    </label>
                    <label className="check-label">
                      <input
                        className="check"
                        type="checkbox"
                        name="days"
                        value="Saturday"
                        checked={form.selectedDays.includes("Saturday")}
                        onChange={handleDaysChange}
                      />
                      <span className="checkmark"></span>
                      Saturday
                    </label>
                    <label className="check-label">
                      <input
                        className="check"
                        type="checkbox"
                        name="days"
                        value="Sunday"
                        checked={form.selectedDays.includes("Sunday")}
                        onChange={handleDaysChange}
                      />
                      <span className="checkmark"></span>
                      Sunday
                    </label>
                  </div>
                  <button className="submitButton" onClick={handleNext}>
                    SET SLOTS TYPE
                  </button>
                  <button className="submitButtonSave" type="submit">
                    Save
                  </button>
                </div>
                {visible ? <p className="error">{error}</p> : ""}
              </form>
            </div>
          </div>
        ) : (
          <>
            <Navbar />

            <div className="MainContainerSlots">
              <div className="title">Select a category for each slot</div>
              <div className="SlotsContainer">
                {form.calender &&
                  Object.keys(form.calender).length > 0 &&
                  form.calender[Object.keys(form.calender)[0]].slots.map(
                    (slot) => (
                      <Slot
                        info={slot}
                        key={slot.time.join("")}
                        onChangeType={handleSlotTypeChange}
                      />
                    )
                  )}
              </div>
              <button className="UpdateBtn" type="submit" onClick={update}>
                Update
              </button>
            </div>
          </>
        )
      ) : (
        <p className="authorizedMessage">
          You are not authorized to access this page. Please login first!
        </p>
      )}
    </>
  );
}
