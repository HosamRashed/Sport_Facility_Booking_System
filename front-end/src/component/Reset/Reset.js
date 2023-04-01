import { Component } from "react";
import image from "../images/MMULogo.png";
import "./Reset.css";
import Cookies from "universal-cookie";
class Reset extends Component {
  cookies = new Cookies();
  token = this.cookies.get("TOKEN") || null;

  state = {
    userID: "",
    answer: "",
  };

  handlChanged = (event) => {
    const { value, name } = event.target;
    this.setState(() => {
      return {
        [name]: value,
      };
    });
  };

  submit = (event) => {
    event.preventDefault();
    console.log("request submitted");
  };

  render() {
    return (
      <>
        {this.token ? (
          <div className="ResetContainer">
            <form onSubmit={this.submit} className="Content">
              <img src={image} alt="mmu logo" className="mmuLogo" />
              <h1 className="title">Change Password</h1>
              <label htmlFor="userID" value="userID">
                User ID
              </label>
              <input
                id="userID"
                type="text"
                onChange={this.handlChanged}
                name="userID"
                value={this.state.userID}
              />
              <label htmlFor="question" value="userID">
                Answer the secret question
              </label>
              <input
                id="question"
                type="password"
                onChange={this.handlChanged}
                name="answer"
                value={this.state.answer}
              />
              <button className="ResetBTN">Reset Password</button>
            </form>
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

export default Reset;
