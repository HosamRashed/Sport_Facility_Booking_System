import React, { useEffect, useState } from "react";
import Navbar from "../../Navbar/Navbar";
import Cookies from "universal-cookie";
import * as AiIcons from "react-icons/ai";
import * as FiIcons from "react-icons/fi";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Facility.css";
import Swal from "sweetalert2";

const Facility = () => {
  const cookies = new Cookies();
  const token = cookies.get("TOKEN");
  const [facilities, setFacilities] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Add isLoading state variable
  useEffect(() => {
    getData();
  }, []);

  const alert = (facility_id) => {
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
          const config = {
            method: "POST",
            url: "http://localhost:3000/facility/delete",
            data: {
              userId: facility_id,
            },
          };
          axios(config)
            .then((response) => {
              console.log(" The facility is deleteds", response);
              getData();
            })
            .catch((error) => {
              console.log(error);
            });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
        }
      });
  };

  const delteFacility = (facility_id) => {
    alert(facility_id);
  };

  const getData = () => {
    axios
      .get("http://localhost:3000/api/facility")
      .then((response) => {
        setFacilities(response.data.data);
        setIsLoading(false); // Set isLoading to false when data is fetched
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  const components = facilities.map((facility) => {
    return (
      <tr key={facility._id}>
        <td>
          <img src={facility.image} height="50px" width="50px" alt="" />
        </td>
        <td>{facility.name}</td>
        <td>
          {facility.startTime} - {facility.endTime}
        </td>
        <td>
          <button>Add timetable</button>
        </td>
        <td>
          <Link to="#" className="icon">
            <AiIcons.AiOutlineDelete
              onClick={() => {
                delteFacility(facility._id);
              }}
            />
          </Link>
          <Link to="#" className="icon">
            <FiIcons.FiEdit />
          </Link>
        </td>
        <td></td>
      </tr>
    );
  });

  const displayFacility =
    facilities.length > 0 ? (
      <div className="facilityTable">
        <table>
          <caption>Available Facilities</caption>
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Available Time</th>
            </tr>
          </thead>
          <tbody>{components}</tbody>
        </table>
        <button
          className="btnCreate"
          onClick={() => {
            window.location.href = "/facility/create";
          }}
        >
          create new Facility{" "}
        </button>
      </div>
    ) : (
      <p className="errorContainer"> There is no facility to be displayed</p>
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
              displayFacility
            )}
          </div>
        </div>
      ) : (
        <p className="errorContainer">
          You are not authorized to access this page you have to login first!
        </p>
      )}
    </>
  );
};
export default Facility;