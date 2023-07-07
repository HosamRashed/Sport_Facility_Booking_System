import React, { useState } from "react";
import axios from "axios";
import * as IoIcons from "react-icons/io";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import "./EditStudent.css";

export default function EditStudent(props) {
  const { prevStudent, clicked, update } = props;
  const [updateForm, setUpdatesForm] = useState(prevStudent);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUpdatesForm((prevData) => ({ ...prevData, [name]: value }));
  };

  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    backgroundColor: "green",
    timer: 2000,
    timerProgressBar: true,
  });
  
  const handleSubmit = (event) => {
    event.preventDefault();
    
    console.log(updateForm.User_Email);
    const config = {
      method: "PUT",
      url: `http://localhost:3000/students/${updateForm._id}`,
      data: {
        User_ID: updateForm.User_ID,
        User_Email: updateForm.User_Email,
        Full_Name: updateForm.Full_Name,
        SecretQuestion: updateForm.SecretQuestion,
        AnswerQuestion: updateForm.AnswerQuestion,
        Password: updateForm.Password,
        User_Gender: updateForm.User_Gender,
        User_status: updateForm.status ? "active" : "barred",
      },
    };

    axios(config)
      .then((response) => {
        console.log("Student information updated successfully!", response.data);
        setUpdatesForm(prevStudent);
        Toast.fire({
          title: "Facility updated successfully!",
          background: "#18a146",
          color: "white",
        });
        update();
        clicked();
      })
      .catch((error) => {
        console.log(error);
        Swal.fire({
          title: "Error!",
          text: "Failed to update facility!",
          confirmButtonText: "OK",
        });
      });
  };

  return (
    <>
      <div className="modal">
        <div onClick={clicked} className="overlay"></div>
        <div className="modal-content">
          <label className="Formlabel"> Student Profile </label>
          <form onSubmit={handleSubmit} className="Edit">
            <table className="editTable">
              <tbody>
                <tr>
                  <td>
                    <label>Student ID:</label>
                  </td>
                  <td>
                    <input
                      className="EditInfo"
                      type="text"
                      onChange={handleChange}
                      name="User_ID"
                      value={updateForm.User_ID}
                    />
                  </td>
                </tr>

                <tr>
                  <td>
                    <label>Student Name:</label>
                  </td>
                  <td>
                    <input
                      className="EditInfo"
                      type="text"
                      onChange={handleChange}
                      name="Full_Name"
                      value={updateForm.Full_Name}
                    />
                  </td>
                </tr>

                <tr>
                  <td>
                    <label>Student Email:</label>
                  </td>
                  <td>
                    <input
                      className="EditInfo"
                      type="text"
                      onChange={handleChange}
                      name="User_Email"
                      value={updateForm.User_Email}
                    />
                  </td>
                </tr>

                <tr>
                  <td>
                    <label>Secret Answer:</label>
                  </td>
                  <td>
                    <input
                      className="EditInfo"
                      type="text"
                      onChange={handleChange}
                      name="AnswerQuestion"
                      value={updateForm.AnswerQuestion}
                    />
                  </td>
                </tr>

                <tr>
                  <td>
                    <label className="marginleft">Student Gender:</label>
                  </td>
                  <td>
                    <input
                      className="EditInfo"
                      type="text"
                      onChange={handleChange}
                      name="User_Gender"
                      value={updateForm.User_Gender}
                    />
                  </td>
                </tr>
              </tbody>
            </table>

            <button className="updateButton" type="submit">
              Update
            </button>
          </form>
          <Link className="close-modal" onClick={clicked}>
            <IoIcons.IoMdClose />
          </Link>
        </div>
      </div>
    </>
  );
}
