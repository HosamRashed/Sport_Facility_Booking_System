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

  const convertImage = (file, callback) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      callback(reader.result);
    };
    reader.onerror = (error) => {
      console.log("Error converting image: ", error);
    };
  };

  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    backgroundColor: "green",
    timer: 2000,
    timerProgressBar: true,
  });

  const setImage = (event) => {
    convertImage(event.target.files[0], (result) => {
      setUpdatesForm((prevData) => ({ ...prevData, image: result }));
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const config = {
      method: "PUT",
      url: `http://localhost:3000/students/${updateForm._id}`,
      data: {
        User_ID: updateForm.User_ID,
        User_Email: updateForm.User_Email,
        User_Name: updateForm.User_Name,
        password: updateForm.password,
        User_Gender: updateForm.User_Gender,
        User_status: updateForm.status ? "Active" : "Barred",
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
          <form onSubmit={handleSubmit} className="Edit ">
            <div>
              <label className="marginRight"> Student ID: </label>
              <input
                className="EditInfo "
                type="text"
                onChange={handleChange}
                name="User_ID"
                value={updateForm.User_ID}
              />
            </div>

            <div>
              <label> Student Name: </label>
              <input
                className="EditInfo"
                type="text"
                onChange={handleChange}
                name="User_Name"
                value={updateForm.Full_Name}
              />
            </div>

            <div>
              <label> Secret Question: </label>
              <input
                className="EditInfo"
                type="text"
                onChange={handleChange}
                name="User_Email"
                value={updateForm.SecretQuestion}
              />
            </div>

            <div>
              <label> Secret Answer: </label>
              <input
                className="EditInfo"
                type="text"
                onChange={handleChange}
                name="User_Email"
                value={updateForm.AnswerQuestion}
              />
            </div>

            <div>
              <label className="marginleft"> Student Gender: </label>
              <input
                className="EditInfo"
                type="text"
                onChange={handleChange}
                name="User_Gender"
                value={updateForm.User_Gender}
              />
            </div>
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
