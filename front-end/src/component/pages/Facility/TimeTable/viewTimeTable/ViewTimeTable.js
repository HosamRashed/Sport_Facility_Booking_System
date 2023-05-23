import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../../../Navbar/Navbar";
import Cookies from "universal-cookie";
import "./ViewTimeTable.css";
import Swal from "sweetalert2";
import { useParams } from "react-router-dom";

export default function ViewTimeTable() {
  const params = useParams();
  const cookies = new Cookies();
  const token = cookies.get("TOKEN");
  const [isLoading, setIsLoading] = useState(true); // Add isLoading state variable

  const [facility, setFacility] = useState({});

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    axios
      .get(`http://localhost:3000/facilities/${params.id}`)
      .then((response) => {
        setFacility(response.data.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  console.log(facility);
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
      title: "Facility has been updated successfully",
      background: "#18a146",
      color: "white",
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  const edit = (event) => {
    event.preventDefault();
  };

  const back = (event) => {
    event.preventDefault();
  };

  return (
    <>
      {token ? (
        <div className="MainPage">
          <Navbar />
          {isLoading ? (
            <p className="errorContainer">Loading...</p>
          ) : (
            <div className="Content">
              <div className="ContainerTime">
                <h3>Available Time:</h3>
                <div className="time">
                  {facility.availableFrom > 12
                    ? facility.availableFrom - 12 + " pm"
                    : facility.availableFrom + " am"}{" "}
                </div>
                <div className="time">
                  {facility.availableTo > 12
                    ? facility.availableTo - 12 + " pm"
                    : facility.availableTo + " am"}{" "}
                </div>
              </div>
              <div className="Container">
                <h3>Available Days:</h3>
                <div className="AvailableDays">
                  {facility.selectedDays.map((day, index) => {
                    return <p key={index}>{day}</p>;
                  })}
                </div>{" "}
              </div>
              <div className="slotsContainer">
                <h3 className="slotTitle">Slots:</h3>
                <div className="slots">
                  {facility.calender[0].slots.map((slot, index) => {
                    return (
                      <div className="slot">
                        From{" "}
                        {slot.time[0] > 12
                          ? slot.time[0] - 12 + " pm"
                          : slot.time[0] + " am"}{" "}
                        To{" "}
                        {slot.time[1] > 12
                          ? slot.time[1] - 12 + " pm"
                          : slot.time[1] + " am"}
                        <h4 className="type">
                          {slot.availability === "available"
                            ? slot.type
                            : "Booked"}
                        </h4>
                      </div>
                    );
                  })}
                </div>{" "}
              </div>
              <div className="button">
                <button
                  className="submitButton"
                  onClick={() =>
                    (window.location.href = `/facility/${params.id}/timeTable`)
                  }
                >
                  EDIT
                </button>{" "}
                <button
                  className="backBtn"
                  onClick={() => (window.location.href = "/facility")}
                >
                  CLOSE
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <p className="authorizedMessage">
          You are not authorized to access this page. Please login first!
        </p>
      )}
    </>
  );
}
