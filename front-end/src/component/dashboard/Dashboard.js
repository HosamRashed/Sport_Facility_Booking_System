import { Component } from "react";
import Cookies from "universal-cookie";
import "./Dashboard.css";
import Navbar from "../Navbar/Navbar"

class Dashboard extends Component {
  cookies = new Cookies();
  token = this.cookies.get("TOKEN");
  state = {};
  handleClick = () => {
    this.cookies.remove("TOKEN", { path: "/" });
    window.location.href = "/";
  };
  render() {
    return (
      <>
        {this.token ? (
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
  }
}

export default Dashboard;
