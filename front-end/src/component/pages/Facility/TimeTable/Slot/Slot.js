import React from "react";
import "./Slot.css";

const Slot = (props) => {
  let startTime = props.info.availableFrom;

  return (
    <div className="mainContainer">
      <h3>
        Facility Name <br />
        From {props.info.availableFrom} To {props.info.availableTo}{" "}
      </h3>
      
    </div>
  );
};

export default Slot;
