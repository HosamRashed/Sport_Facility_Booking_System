import React, { useEffect, useState } from "react";
import Navbar from "../../Navbar/Navbar";
import Cookies from "universal-cookie";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Activities.css";
import { FaStar, FaRegStar } from "react-icons/fa";

const Activities = () => {
  const cookies = new Cookies();
  const token = cookies.get("TOKEN");
  const [facilities, setFacilities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const currentDateTime = new Date();
  const currentDay = currentDateTime.getDate();
  const currentMonth = currentDateTime.getMonth() + 1;

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    axios
      .get("http://localhost:3000/api/facility")
      .then((response) => {
        setFacilities(response.data.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  const calculateRating = (facilityInfo) => {
    let NoOfStars = 0;

    if (facilityInfo.rating.length > 0) {
      for (let i = 0; i < facilityInfo.rating?.length; i++) {
        NoOfStars += facilityInfo.rating[i].value;
      }
      return NoOfStars / facilityInfo.rating.length;
    } else {
      return 0;
    }
  };

  const calculateBookings = (facilityInfo) => {
    let lastMonth = 0;
    let lastWeek = 0;

    facilityInfo.reservationTimes?.forEach((booking) => {
      const [bookedDay, bookedMonth] = booking.date.split("/").map(Number);
      let daysDiff = Math.floor(currentDay - bookedDay);
      const monthDiff = currentMonth - bookedMonth;

      if (monthDiff >= 1) {
        daysDiff += monthDiff * 30;
      }

      if (daysDiff <= 30) {
        lastMonth++;
      }
      if (daysDiff <= 7) {
        lastWeek++;
      }
    });

    return [lastMonth, lastWeek];
  };

  const getStarIcons = (averageStars) => {
    const filledStars = Math.floor(averageStars);
    const emptyStars = 5 - filledStars;
    const starIcons = [];

    for (let i = 0; i < filledStars; i++) {
      starIcons.push(<FaStar key={i} className="filled-star" />);
    }

    for (let i = 0; i < emptyStars; i++) {
      starIcons.push(
        <FaRegStar key={filledStars + i} className="empty-star" />
      );
    }

    return starIcons;
  };

  const components = facilities.map((facility) => {
    const [lastMonth, lastWeek] = calculateBookings(facility);
    const averageStars = calculateRating(facility);
    const starIcons = getStarIcons(averageStars);

    return (
      <tr key={facility._id}>
        <td>
          <img src={facility.image} height="50px" width="50px" alt="" />
        </td>
        <td>{facility.name}</td>
        <td>{lastMonth}</td>
        <td>{lastWeek}</td>
        <td>
          {averageStars > 0 ? (
            <div className="star-container">{starIcons}</div>
          ) : (
            <div className="star-container">{starIcons}</div>
          )}
        </td>
      </tr>
    );
  });

  const displayFacility =
    facilities?.length > 0 ? (
      <div className="facilityTable">
        <table>
          <caption>Available Facilities</caption>
          <thead>
            <tr>
              <th>Image</th>
              <th>Facility Name</th>
              <th>Booked last month</th>
              <th>Booked last week</th>
              <th>Average rating star</th>
            </tr>
          </thead>
          <tbody>{components}</tbody>
        </table>
      </div>
    ) : (
      <div className="empty">
        <p className="errorContainer">There is no facility to be displayed</p>
      </div>
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
          You are not authorized to access this page. You have to log in first!
        </p>
      )}
    </>
  );
};

export default Activities;
