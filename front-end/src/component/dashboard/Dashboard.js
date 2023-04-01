import { Component } from "react";
import Cookies from "universal-cookie";
import "./Dashboard.css";

class Dashboard extends Component {
  cookies = new Cookies();
  token = this.cookies.get("TOKEN");
  state = {};
  handleClick = () => {
    this.cookies.remove("TOKEN", { path: "/" });
    window.location.href = "/login";
  };
  render() {
    return (
      <>
        {this.token ? (
          <div className="MainContainer">
            <button className="logOut" onClick={this.handleClick}>
              Log out
            </button>
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
