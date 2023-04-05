import React from "react";
import Navbar from "../../Navbar/Navbar";
import Cookies from "universal-cookie";

const Activities = () => {
  const cookies = new Cookies();
  const token = cookies.get("TOKEN");
  return (
    <>
      {token ? (
        <div className="MainContainer">
          <Navbar />
        </div>
      ) : (
        <p className="authorizedMessage">
          You are not authorized to access this page you have to login first!
        </p>
      )}
    </>
  );
};

export default Activities;
