import React, { useState } from "react";
import axios from "axios";
import Navbar from "../../Navbar/Navbar";
import Cookies from "universal-cookie";
import "./Announcement.css";

export default function Announcement() {
  const initialize = {
    title: "",
    content: "",
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

  const handleSubmit = (event) => {
    event.preventDefault();
    const config = {
      method: "POST",
      url: "http://localhost:3000/announcement",
      data: {
        title: form.title,
        content: form.content,
        image: form.image,
      },
    };
    axios(config)
      .then((response) => {
        console.log("succes creating facility");
        console.log(response.data);
        window.location.href = "/facility";
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
                <label>Announcement Title: </label>
                <input
                  id="title"
                  type="text"
                  onChange={handleChange}
                  name="title"
                  value={form.title}
                />
              </div>

              <div>
                <label>Announcement Content:</label>
                <textarea
                  id="content"
                  onChange={handleChange}
                  name="content"
                  value={form.content}
                />
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
