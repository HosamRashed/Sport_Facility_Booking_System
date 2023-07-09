import React, { useEffect, useState } from "react";
import Navbar from "../../Navbar/Navbar";
import Cookies from "universal-cookie";
import * as AiIcons from "react-icons/ai";
import { Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

let newFacility;
const Bookings = () => {
  const cookies = new Cookies();
  const token = cookies.get("TOKEN");
  const [modal, setModal] = useState(false);

  const [bookings, setBookings] = useState([]);
  const [facility, setFacility] = useState([]);
  const [selecBookings, setSelecBookings] = useState(null);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getData();
  }, []);

  const alert = (booking) => {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger",
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons
      .fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          deletebooking(booking);
        } else if (result.dismiss === Swal.DismissReason.cancel) {
        }
      });
  };

  const getData = () => {
    axios
      .get("http://localhost:3000/api/bookings")
      .then((response) => {
        setBookings(response.data.data);
        console.log(bookings);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  const getFacility = (facility) => {
    axios
      .get(`http://localhost:3000/facilities/${facility}`)
      .then((response) => {
        setFacility(response.data.data);
        return;
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  const updateDatabase = () => {
    const config = {
      method: "PUT",
      url: `http://localhost:3000/facilities/update/${newFacility._id}`,
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

  const updateBookings = (booking) => {
    const config = {
      method: "DELETE",
      url: `http://localhost:3000/bookings/delete/${booking._id}`,
    };
    axios(config)
      .then((response) => {
        console.log("The booking is deleted");
        updateDatabase();
        getData();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const deletebooking = (bookingInfo) => {
    getFacility(bookingInfo.facilityID);

    console.log(facility);
    const updatedFacility = { ...facility };
    const updatedCalender = Array.isArray(updatedFacility.calendar)
      ? [...updatedFacility.calendar]
      : [];

    const calenderIndex = updatedCalender.findIndex(
      (calendar) => calendar.day === bookingInfo.slotDay
    );

    if (calenderIndex !== -1) {
      const selectedDayCalender = { ...updatedCalender[calenderIndex] };
      const updatedSlots = Array.isArray(selectedDayCalender.slots)
        ? [...selectedDayCalender.slots]
        : [];

      const selectedSlot = updatedSlots.find(
        (slot) => slot._id === bookingInfo.slot_ID
      );

      const selectedSlotIndex = updatedSlots.findIndex(
        (slot) => slot._id === bookingInfo.slot_ID
      );

      if (selectedSlot) {
        updatedSlots[selectedSlotIndex] = {
          ...selectedSlot,
          availability: "available",
          type: selectedSlot.prevType,
          userID: null,
          prevType: null,
        };

        selectedDayCalender.slots = updatedSlots;

        updatedCalender[calenderIndex] = selectedDayCalender;

        updatedFacility.calendar = updatedCalender;

        const mainObject = { ...updatedFacility };

        setFacility(mainObject);
        newFacility = mainObject;

        // console.log(newFacility.calendar[calenderIndex]);
        updateBookings(bookingInfo);
      }
    }
  };

  const components = bookings.map((booking) => {
    return (
      <tr key={booking._id}>
        <td>{booking.studentName}</td>
        <td>{booking.facilityName}</td>
        <td>{booking.slotDate}</td>
        <td>
          {booking.slotTime[0] === 12
            ? booking.slotTime[0] + " pm"
            : booking.slotTime[0] > 12
            ? booking.slotTime[0] - 12 + " pm"
            : booking.slotTime[0] + " am"}
        </td>
        <td>
          {booking.slotTime[1] === 12
            ? booking.slotTime[1] + " pm"
            : booking.slotTime[1] > 12
            ? booking.slotTime[1] - 12 + " pm"
            : booking.slotTime[1] + " am"}
        </td>
        <td>{booking.status}</td>
        <td>
          <Link to="#" className="icon">
            <AiIcons.AiOutlineDelete
              onClick={() => {
                alert(booking);
              }}
            />
          </Link>
        </td>
        <td></td>
      </tr>
    );
  });

  const displayAnnouncement =
    bookings.length > 0 ? (
      <div className="facilityTable">
        <table>
          <caption>Bookings List</caption>
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Facility Name</th>
              <th>Booking Date</th>
              <th>From</th>
              <th>To</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>{components}</tbody>
        </table>
      </div>
    ) : (
      <p className="errorContainer">
        {" "}
        There is no any bookings to be displayed
      </p>
    );

  return (
    <>
      {token ? (
        <div className="MainContainer">
          <Navbar />
          <div>
            {isLoading ? (
              <p className="errorContainer">Loading...</p>
            ) : (
              displayAnnouncement
            )}
          </div>
          {/* {modal && (
            <EditStudent
              update={getData}
              prevStudent={selecStudent}
              clicked={toggleModal}
            />
          )} */}
        </div>
      ) : (
        <p className="errorContainer">
          You are not authorized to access this page you have to login first!
        </p>
      )}
    </>
  );
};

export default Bookings;
