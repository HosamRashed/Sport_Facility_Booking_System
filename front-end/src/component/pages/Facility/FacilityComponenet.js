import React from "react";
import * as AiIcons from "react-icons/ai";
import * as FiIcons from "react-icons/fi";
import { Link } from "react-router-dom";
import "./Facility.css";

const FacilityComponenet = (props) => {
  <tr>
    <td>
      <img src={props.data[0].image} height="50px" width="50px" alt="" />
    </td>
    <td>{props.data[0].name}</td>
    <td>
      {props.data[0].startTime} - {props.data[0].endTime}
    </td>
    <td>
      <Link to="#" className="icon">
        <AiIcons.AiOutlineDelete />
      </Link>{" "}
      <Link to="#" className="icon">
        <FiIcons.FiEdit />
      </Link>
    </td>
  </tr>;
  return (
    <div>
      <table>
        <caption>Available Facilities</caption>
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Available Time</th>
          </tr>
        </thead>
        <tbody>
          {props.data.map((facility, index) => (
            <tr>
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
                  <AiIcons.AiOutlineDelete />
                </Link>{" "}
                <Link to="#" className="icon">
                  <FiIcons.FiEdit />
                </Link>
              </td>
              <td></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FacilityComponenet;
