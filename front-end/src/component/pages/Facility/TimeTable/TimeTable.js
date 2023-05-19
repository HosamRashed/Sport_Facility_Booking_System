import React, { useState } from "react";
import axios from "axios";
import Navbar from "../../../Navbar/Navbar";
import Cookies from "universal-cookie";
import "./TimeTable.css";
import Slot from "./Slot/Slot";
import Swal from "sweetalert2";
import { MdAirplanemodeActive } from "react-icons/md";

export default function TimeTable() {
  const initialize = {
    availableFrom: "10",
    availableTo: "13",
    duration: "",
    selectedDays: [],
    calender: {},
  };

  const [form, setForm] = useState(initialize);
  const [next, setNext] = useState(false);
  const [error, setError] = useState("");
  const [visible, setVisible] = useState(false);
  let numberOfSlots;
  let slots;
  const [content, setContent] = useState(true);
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

  const slotsdevide = () => {
    numberOfSlots =
      (parseInt(form.availableTo) - parseInt(form.availableFrom)) /
      form.duration;
    let startTime = parseInt(form.availableFrom);
    const availableSlots = [];

    for (let i = 0; i < numberOfSlots; i++) {
      availableSlots.push({
        time: [startTime, startTime + 2],
        availability: "available",
        type: "",
      });
      startTime = startTime + 2;
    }
    return availableSlots;
  };

  const prepareContent = () => {
    slots = slotsdevide();
    const days = form.selectedDays.map((day) => {
      return {
        [day]: {
          slots,
        },
      };
    });

    form.calender = form.calender || {};

    days.forEach((day) => {
      const dayName = Object.keys(day)[0];
      if (!form.calender[dayName]) {
        form.calender[dayName] = day[dayName];
      } else {
        form.calender[dayName].slots = slots;
      }
    });

    console.log(form.calender.Thursday.slots[0].time);

    // setContent(true);
  };

  const handleNext = (event) => {
    event.preventDefault();
    if (checkInputs()) {
      prepareContent();
    }
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
      title: "Facility has been created successfully",
      background: "#18a146",
      color: "white",
    });
  };

  const handleSubmit = (event) => {
    // event.preventDefault();
    // const config = {
    //   method: "POST",
    //   url: "http://localhost:9229/facility/create",
    //   data: {
    //     name: form.name,
    //     description: form.description,
    //     startTime: form.startTime,
    //     endTime: form.endTime,
    //     image: form.image,
    //     duration: form.duration,
    //     availableDays: form.selectedDays,
    //   },
    // };
    // axios(config)
    //   .then((response) => {
    //     setForm(initialize);
    //     alert();
    // setTimeout(() => {
    // window.location.href = "/facility";
    // }, 3000);
    // })
    // .catch((error) => {
    // console.log(error);
    // });
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
                    id="availableTo"
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
                  {!next ? (
                    <button className="submitButton" onClick={handleNext}>
                      Next
                    </button>
                  ) : (
                    <button className="submitButton" type="submit">
                      Save
                    </button>
                  )}
                </div>
                {visible ? <p className="error">{error}</p> : ""}
              </form>
            </div>
          </div>
        ) : (
          <>
            <Navbar />
            <div className="MainContainerSlots">
              <div className="SlotsContainer">
                <Slot info={form} />
              </div>
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
