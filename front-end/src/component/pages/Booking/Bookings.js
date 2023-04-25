import React, { useState } from "react";
import Navbar from "../../Navbar/Navbar";
import Cookies from "universal-cookie";

const Bookings = () => {
  const cookies = new Cookies();
  const token = cookies.get("TOKEN");

  const WEEK_DAYS = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const START_TIME = "08:00:00";
  const END_TIME = "16:00:00";
  const SLOT_DURATION = 30; // in minutes

  const [weekSlots, setWeekSlots] = useState([]);

  const createSlots = () => {
    const startDateTime = new Date();
    startDateTime.setHours(parseInt(START_TIME.split(":")[0], 10));
    startDateTime.setMinutes(parseInt(START_TIME.split(":")[1], 10));
    startDateTime.setSeconds(parseInt(START_TIME.split(":")[2], 10));
    startDateTime.setMilliseconds(0);

    const endDateTime = new Date();
    endDateTime.setHours(parseInt(END_TIME.split(":")[0], 10));
    endDateTime.setMinutes(parseInt(END_TIME.split(":")[1], 10));
    endDateTime.setSeconds(parseInt(END_TIME.split(":")[2], 10));
    endDateTime.setMilliseconds(0);

    const timeSlots = [];
    let currentDateTime = startDateTime;
    while (currentDateTime < endDateTime) {
      timeSlots.push(currentDateTime);
      currentDateTime = new Date(
        currentDateTime.getTime() + SLOT_DURATION * 60 * 1000
      );
    }

    const weekSlots = WEEK_DAYS.map((day) => ({
      day: day,
      slots: timeSlots.map((slot) => ({ time: slot, status: "unavailable" })),
    }));

    setWeekSlots(weekSlots);
  };

  const handleStatusChange = (dayIndex, slotIndex, newStatus) => {
    const updatedWeekSlots = [...weekSlots];
    updatedWeekSlots[dayIndex].slots[slotIndex].status = newStatus;
    setWeekSlots(updatedWeekSlots);
  };

  const formatTime = (time) => {
    const date = new Date(time);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <>
      {token ? (
        <div className="MainContainer">
          <Navbar />
          <div>
            <button onClick={createSlots}>Create Slots</button>
            {weekSlots.length > 0 && (
              <table>
                <thead>
                  <tr>
                    <th></th>
                    {WEEK_DAYS.map((day, index) => (
                      <th key={index}>{day}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {weekSlots[0].slots.map((time, index) => (
                    <tr key={index}>
                      <td>{formatTime(time)}</td>
                      {weekSlots.map((day, index) => (
                        <td key={index}>
                          <select
                            value={day.slots[index].status}
                            onChange={(e) =>
                              handleStatusChange(index, e.target.value)
                            }
                          >
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="mix">Mix</option>
                            <option value="unavailable">Unavailable</option>
                          </select>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      ) : (
        <p className="authorizedMessage">
          You are not authorized to access this page you have to login first!
        </p>
      )}
    </>
  );
};

export default Bookings;
