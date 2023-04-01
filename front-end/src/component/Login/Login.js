import React, { useState } from "react";
import "./login.css";
import image from "../images/MMULogo.png";
import { Link } from "react-router-dom";
import axios from "axios";
import Cookies from "universal-cookie";

const Login = () => {
  const cookies = new Cookies();
  const [failedMessages, setFailedMessages] = useState(false);

  const initiolaize = {
    userID: "",
    password: "",
  };

  const [formData, setFormData] = useState(initiolaize);
  const [login, setLogin] = useState(null);
  function handlChanged(event) {
    const { value, name } = event.target;
    setFormData((prevData) => {
      return { ...prevData, [name]: value };
    });
  }

  const submit = (event) => {
    console.log("hello");
    event.preventDefault();
    // set configurations
    const configuration = {
      method: "post",
      url: "https://sportbooking-0zwf-main-ga64yyugvq-wm.a.run.app/login",
      data: {
        User_ID: formData.userID,
        password: formData.password,
      },
    };
    axios(configuration)
      .then((result) => {
        cookies.set("TOKEN", result.data.token, { path: "/" });
        window.location.href = "/dashboard";
      })
      .catch((error) => {
        setFailedMessages((prevData) => {
          return !prevData;
        });
      });
  };

  return (
    <div className="LoginContainer">
      <img src={image} alt="mmu logo" className="mmuLogo" />
      <h1 className="title1">Admin Portal</h1>
      <h3 className="title2">LOG IN</h3>

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
        <Link to="/login/reset-password">
          <p className="reset">Reset Password</p>
        </Link>
      </form>
      {failedMessages && <p className="errormessage">INCORRECT CREDENTIALS</p>}
    </div>
  );
};

export default Login;
