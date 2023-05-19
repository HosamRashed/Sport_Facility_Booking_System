import React, { useEffect, useState } from "react";
import Navbar from "../../Navbar/Navbar";
import Cookies from "universal-cookie";
import * as AiIcons from "react-icons/ai";
import * as FiIcons from "react-icons/fi";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Announcements.css";
import Swal from "sweetalert2";
import EditAnnouncement from "./editAnnouncement/EditAnnouncement";


const Announcement = () => {
  const cookies = new Cookies();
  const token = cookies.get("TOKEN");
  const [modal, setModal] = useState(false);

  const [announcements, setAnnouncements] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Add isLoading state variable
  const [selectAnnouncement, setSelectAnnouncement] = useState(null);
  useEffect(() => {
    getData();
  }, []);

  const alert = (announcement_id) => {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger",
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons
      .fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          const config = {
            method: "DELETE",
            url: `http://localhost:3000/announcement/delete/${announcement_id}`,
          };
          axios(config)
            .then((response) => {
              console.log(" The announcement has been deleted", response);
              getData();
            })
            .catch((error) => {
              console.log(error);
            });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
        }
      });
  };

  const toggleModal = (announcement) => {
    setSelectAnnouncement(announcement);
    setModal(!modal);
  };

  const delteAnnouncement = (announcement_id) => {
    alert(announcement_id);
  };

  const getData = () => {
    axios
      .get("http://localhost:9229/api/announcements")
      .then((response) => {
        setAnnouncements(response.data.data);
        setIsLoading(false); // Set isLoading to false when data is fetched
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  const components = announcements.map((announcement) => {
    return (
      <tr key={announcement._id}>
        <td>{announcement.title}</td>
        <td>{announcement.content}</td>

        <td>
          <Link to="#" className="icon">
            <AiIcons.AiOutlineDelete
              onClick={() => {
                delteAnnouncement(announcement._id);
              }}
            />
          </Link>
          <Link to="#" className="icon">
            <FiIcons.FiEdit onClick={() => toggleModal(announcement)} />
          </Link>
        </td>
        <td></td>
      </tr>
    );
  });

  const displayAnnouncement =
    announcements.length > 0 ? (
      <div className="facilityTable">
        <table>
          <caption>Current Announcemnets</caption>
          <thead>
            <tr>
              <th>Announcemnet Title</th>
              <th>Announcemnet Descirption</th>
            </tr>
          </thead>
          <tbody>{components}</tbody>
        </table>
        <button
          className="btnCreate"
          onClick={() => {
            window.location.href = "/announcements/create";
          }}
        >
          POST A NEW ANNOUNCEMENT
        </button>
      </div>
    ) : (
      <p className="errorContainer"> There is no facility to be displayed</p>
    );

  return (
    <>
      {token ? (
        <div className="MainContainer">
          <Navbar />
          <div>
            {isLoading ? (
              <p className="errorContainer">Loading...</p>
            ) : (
                displayAnnouncement
            )}
          </div>
          {modal && (
            <EditAnnouncement
              update={getData}
              prevAnnouncement={selectAnnouncement}
              clicked={toggleModal}
            />
          )}
        </div>
      ) : (
        <p className="errorContainer">
          You are not authorized to access this page you have to login first!
        </p>
      )}
    </>
  );
};
export default Announcement;
