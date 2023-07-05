import React, { useEffect, useState } from "react";
import Navbar from "../../Navbar/Navbar";
import Cookies from "universal-cookie";
import * as AiIcons from "react-icons/ai";
import { Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

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

  // const toggleModal = (student) => {
  //   setSelecStudent(student);
  //   setModal(!modal);
  // };

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
      })
      .catch((error) => {
        console.log("error", error);
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
        getData();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const deletebooking = (bookingInfo) => {
    getFacility(bookingInfo.facilityID);

    const updatedFacility = { ...facility };
    const updatedCalender = Array.isArray(updatedFacility.calender)
      ? [...updatedFacility.calender]
      : [];

    const calenderIndex = updatedCalender.findIndex(
      (calender) => calender.day === bookingInfo.slotDay
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

        updatedFacility.calender = updatedCalender;

        const mainObject = { ...updatedFacility };
        setFacility(mainObject);

        updateBookings(bookingInfo);
        console.log(mainObject);
      }
    }
  };

  const components = bookings.map((booking) => {
    return (
      <tr key={booking._id}>
        <td>{booking.studentName}</td>
        <td>{booking.facilityName}</td>
        <td>{booking.slotDate}</td>
        <td>{booking.slotTime[0]}</td>
        <td>{booking.slotTime[1]}</td>
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
