import React, { useState } from "react";
import axios from "axios";
import "./EditAnnouncement.css";
import * as IoIcons from "react-icons/io";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

export default function EditAnnouncement(props) {
  const { prevAnnouncement, clicked, update } = props;
  const [updateForm, setUpdatesForm] = useState(prevAnnouncement);

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
      url: `http://localhost:3000/announcement/${prevAnnouncement._id}`,
      data: {
        title: updateForm.title,
        content: updateForm.content,
        image: updateForm.image,
      },
    };

    axios(config)
      .then((response) => {
        console.log("Announcement updated successfully!", response.data);
        setUpdatesForm(prevAnnouncement);
        Toast.fire({
          title: "Announcement updated successfully!",
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
          <label className="label"> Update Announcement </label>
          <form onSubmit={handleSubmit} className="formNew">
            <div>
              <label>Announcement Title: </label>
              <input
                id="title"
                type="text"
                onChange={handleChange}
                name="title"
                value={updateForm.title}
              />
            </div>

            <div>
              <label>Announcement Content:</label>
              <textarea
                id="content"
                onChange={handleChange}
                name="content"
                value={updateForm.content}
              />
            </div>

            <div className="imageUplaoding">
              <label className="uploadImage">Upload image:</label>
              <input
                name="image"
                className="file"
                type="file"
                accept="image/*"
                onChange={setImage}
              />
            </div>

            <button className="EditsubmitBtn" type="submit">
              Save
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
