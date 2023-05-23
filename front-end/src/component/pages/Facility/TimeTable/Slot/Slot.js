import { React, useState } from "react";
import "./Slot.css";

const Slot = (props) => {
  // console.log(props.info.type);

  const [type, setType] = useState(props.info.type);

  const handleTypeChange = (event) => {
    setType(event.target.value);
    props.onChangeType(props.info.time, event.target.value);
  };
  return (
    <div className="mainContainer">
      <h3>
        From{" "}
        {props.info.time[0] > 12
          ? props.info.time[0] - 12 + " pm"
          : props.info.time[0] + " am"}{" "}
        To{" "}
        {props.info.time[1] === 12
          ? props.info.time[1] + " pm"
          : props.info.time[1] > 12
          ? props.info.time[1] - 12 + " pm"
          : props.info.time[1] + " am"}
      </h3>
      <select
        className="slotTime"
        name="availableTo"
        value={type}
        onChange={handleTypeChange}
      >
        <option value="">-- type --</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="mixed">Mixed</option>
        <option value="booked">Booked</option>
      </select>
    </div>
  );
};

export default Slot;
