import React, { useState } from "react";
import "./login.css";
import image from "../../images/MMULogo.png";
import axios from "axios";
import Cookies from "universal-cookie";

const Login = () => {
  const cookies = new Cookies();
  const [error, setError] = useState({});
  const [visible, setVisible] = useState(false);
  const [failedMessages, setFailedMessages] = useState(false);

  const initiolaize = {
    userID: "",
    password: "",
  };

  const [formData, setFormData] = useState(initiolaize);
  function handlChanged(event) {
    const { value, name } = event.target;
    setFormData((prevData) => {
      return { ...prevData, [name]: value };
    });
  }

  const checkInputs = function (event) {
    if (formData.password === "" || formData.userID === "") {
      setError("All inputs are required!");
      setVisible(true);
      return false;
    }
    return true;
  };

  const submit = (event) => {
    event.preventDefault();
    if (checkInputs()) {
      const configuration = {
        method: "post",
        url: "http://localhost:3000/login",
        data: {
          User_ID: formData.userID,
          password: formData.password,
        },
      };
      axios(configuration)
        .then((result) => {
          console.log("success");
          console.log(result);
          cookies.set("TOKEN", result.data.token, { path: "/" });
          window.location.href = "/facility";
        })
        .catch((error) => {
          console.log("fail");
          console.log(error);
          setFailedMessages(true);
        });
    }
  };

  return (
    <div className="LoginContainer">
      <img src={image} alt="mmu logo" className="mmuLogo" />

      <form className="loginForm" onSubmit={submit}>
        <label htmlFor="userID" value="userID">
          User ID
        </label>
        <input
          id="userID"
          type="text"
          onChange={handlChanged}
          name="userID"
          value={formData.userID}
        />
        <label htmlFor="password" value="userID">
          Password
        </label>
        <input
          id="password"
          type="password"
          onChange={handlChanged}
          name="password"
          value={formData.password}
        />
        <button className="submitbutton">Log in</button>
      </form>

      {visible ? <p className="errormessage">{error}</p> : ""}
    </div>
  );
};

export default Login;
