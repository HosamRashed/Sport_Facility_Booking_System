import React, { useEffect, useState } from "react";
import Navbar from "../../Navbar/Navbar";
import Cookies from "universal-cookie";
import FacilityComponenet from "./FacilityComponenet";
import axios from "axios";
import "./Facility.css";

const Facility = () => {
  const cookies = new Cookies();
  const token = cookies.get("TOKEN");
  const [facilities, setFacilities] = useState([]);
  useEffect(() => {
    axios
      .get("http://localhost:3000/api/facility")
      .then((response) => {
        setFacilities(response.data.data);
      })
      .catch((error) => {
        console.log("error", error);
      });
  }, [0]);

  return (
    <>
      {token ? (
        <div className="MainContainer">
          <Navbar />
          {facilities.length > 0 ? (
            <div className="facilityTable">
              <div className="facilitiesContainer">
                <FacilityComponenet data={facilities} />
              </div>
            </div>
          ) : (
            <div className="errorContainer">
              <p>there is no data</p>
            </div>
          )}
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
