import React, { useState } from "react";
import axios from "axios";
import "./EditFacility.css";
import * as IoIcons from "react-icons/io";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

export default function EditFacility(props) {
  const { prevFacility, clicked, update } = props;
  const [updateForm, setUpdatesForm] = useState(prevFacility);

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
      url: `http://localhost:3000/facility/${prevFacility._id}`,
      data: {
        name: updateForm.name,
        description: updateForm.description,
        image: updateForm.image,
        location: updateForm.location,
      },
    };

    axios(config)
      .then((response) => {
        console.log("Facility updated successfully!", response.data);
        setUpdatesForm(prevFacility);
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
          <label className="label"> Edit Facility information </label>
          <form onSubmit={handleSubmit} className="Editform">
            <div>
              <label> Facility Name: </label>
              <input
                id="Editname"
                type="text"
                onChange={handleChange}
                name="name"
                value={updateForm.name}
              />
            </div>

            <div>
              <label className="EdittitleDescription">
                Facility Description:
              </label>
              <textarea
                id="Editdescription"
                type="text"
                onChange={handleChange}
                name="description"
                value={updateForm.description}
              />
            </div>

            <div className="location">
              <div className="coordinates">
                <label>Location:</label>
                <input
                  className="editLocationInput"
                  type="text"
                  onChange={handleChange}
                  name="location"
                  value={updateForm.location}
                />
              </div>
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

            <button className="EditsubmitBtn" type="submit">
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
