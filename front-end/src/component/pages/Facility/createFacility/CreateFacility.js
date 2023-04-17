import React, { useState } from "react";
import axios from "axios";
import Navbar from "../../../Navbar/Navbar";
import Cookies from "universal-cookie";
import "./CreateFacility.css";
import Swal from "sweetalert2";

export default function CreateFacility() {
  const initialize = {
    name: "",
    description: "",
    startTime: "",
    endTime: "",
    image: "",
  };

  const [form, setForm] = useState(initialize);
  const cookies = new Cookies();
  const token = cookies.get("TOKEN");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prevData) => ({ ...prevData, [name]: value }));
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

  const setImage = (event) => {
    convertImage(event.target.files[0], (result) => {
      setForm((prevData) => ({ ...prevData, image: result }));
    });
  };

  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    backgroundColor: "green",
    timer: 3000,
    timerProgressBar: true,
  });

  const alert = () => {
    Toast.fire({
      title: "Facility has created successfully",
      background: "#18a146",
      color: "white",
    });
    setTimeout(() => {
      window.location.href = "/facility";
    }, 3000);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const config = {
      method: "POST",
      url: "http://localhost:3000/facility/create",
      data: {
        name: form.name,
        description: form.description,
        startTime: form.startTime,
        endTime: form.endTime,
        image: form.image,
      },
    };
    axios(config)
      .then((response) => {
        console.log("succes creating facility");
        setForm(initialize);
        alert();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      {token ? (
        <div className="MainContainer">
          <Navbar />
          <div className="formcontainer">
            <form onSubmit={handleSubmit} className="form">
              <div>
                <label>Facility Name: </label>
                <input
                  id="name"
                  type="text"
                  onChange={handleChange}
                  name="name"
                  value={form.name}
                />
              </div>

              <div>
                <label className="titleDescription">
                  Facility Description:
                </label>
                <textarea
                  id="description"
                  type="text"
                  onChange={handleChange}
                  name="description"
                  value={form.description}
                />
              </div>
              <div className="facilityTiming">
                <label htmlFor="startTime">Start From:</label>
                <select
                  id="startTime"
                  name="startTime"
                  value={form.startTime}
                  onChange={handleChange}
                >
                  <option value="">-- Choose --</option>
                  <option value="8.00 AM">8.00 AM</option>
                  <option value="10.00 AM">10.00 AM</option>
                  <option value="12.00 AM">12.00 AM</option>
                  <option value="2.00 PM">2.00 PM</option>
                  <option value="4.00 PM">4.00 PM</option>
                  <option value="6.00 PM">6.00 PM</option>
                </select>

                <label className="endTitle" htmlFor="endTime">
                  End at:
                </label>
                <select
                  id="endTime"
                  name="endTime"
                  value={form.endTime}
                  onChange={handleChange}
                >
                  <option value="">-- Choose --</option>
                  <option value="10.00 AM">10.00 AM</option>
                  <option value="12.00 AM">12.00 AM</option>
                  <option value="2.00 PM">2.00 PM</option>
                  <option value="4.00 PM">4.00 PM</option>
                  <option value="6.00 PM">6.00 PM</option>
                  <option value="8.00 PM">8.00 PM</option>
                </select>
              </div>
              <div className="imageUplaoding">
                <label className="uploadImage">Upload facility image:</label>
                <input
                  name="image"
                  className="file"
                  type="file"
                  accept="image/*"
                  onChange={setImage}
                />
              </div>

              <button className="submitBtn" type="submit">
                Save
              </button>
            </form>
          </div>
        </div>
      ) : (
        <p className="authorizedMessage">
          You are not authorized to access this page you have to login first!
        </p>
      )}
    </>
  );
}
