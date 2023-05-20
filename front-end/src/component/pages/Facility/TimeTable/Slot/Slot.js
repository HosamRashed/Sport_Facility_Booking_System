import { React, useState } from "react";
import "./Slot.css";

const Slot = (props) => {
  console.log(props.info);
  const [type, setType] = useState(props.info.type);

  const handleTypeChange = (event) => {
    setType(event.target.value);
    props.onChangeType(props.info.time, event.target.value);
  };
  return (
    <div className="mainContainer">
      <h3>
        From {props.info.time[0]} To {props.info.time[1]}{" "}
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
        <option value="unavailable">Unavailable</option>
      </select>
    </div>
  );
};

export default Slot;
