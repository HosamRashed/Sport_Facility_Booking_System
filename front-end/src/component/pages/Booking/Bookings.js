import React, { useEffect, useState } from "react";
import Navbar from "../../Navbar/Navbar";
import Cookies from "universal-cookie";
import * as AiIcons from "react-icons/ai";
import { Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const Bookings = () => {
  const cookies = new Cookies();
  const token = cookies.get("TOKEN");
  const [modal, setModal] = useState(false);

  const [students, setStudents] = useState([]);
  const [selecStudent, setSelecStudent] = useState(null);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getData();
  }, []);

  const toggleModal = (student) => {
    setSelecStudent(student);
    setModal(!modal);
  };

  const findIndex = (student_id) => {
    return students.findIndex((student) => student._id === student_id);
  };

  const updateStudentStatus = (studentId, newStatus) => {
    const newStudents = [...students];
    const studentIndex = findIndex(studentId);
    if (studentIndex !== -1) {
      newStudents[studentIndex].status = newStatus;
      setStudents(newStudents);
    }
  };

  const handleStatusChange = (studentId, currentStatus) => {
    const newStatus = !currentStatus;
    const message = newStatus ? "activate" : "bar";
    const studentIndex = findIndex(studentId);

    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger",
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons
      .fire({
        title: `Are you sure you want to ${message} this student?`,
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: `Yes, ${message} it!`,
        cancelButtonText: "No, cancel!",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          const config = {
            method: "DELETE",
            url: `http://localhost:3000/facility/delete/`,
          };
          axios(config)
            .then((response) => {
              console.log(" The facility is deleted", response);
              getData();
            })
            .catch((error) => {
              console.log(error);
            });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
        }
      });
  };

  const getData = () => {
    axios
      .get("http://localhost:3000/api/students")
      .then((response) => {
        const initialStudents = response.data.data.map((student) => {
          return {
            ...student,
            status: student.User_status === "active" ? true : false,
          };
        });
        setStudents(initialStudents);
        console.log(students);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  const deletebooking = () => {
    console.log("clicked");
  };

  const components = students.map((student) => {
    return (
      <tr key={student._id}>
        <td>{student.Full_Name}</td>
        <td>{student.User_ID}</td>
        <td>{student.User_Gender}</td>
        <td>{student.User_Gender}</td>
        <td>{student.User_Gender}</td>
        <td>
          <AiIcons.AiOutlineDelete
            onClick={() => {
              deletebooking();
            }}
          />
        </td>
        <td></td>
      </tr>
    );
  });

  const displayAnnouncement =
    students.length > 0 ? (
      <div className="facilityTable">
        <table>
          <caption>Bookings List</caption>
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Facility Name</th>
              <th>Booking Date</th>
              <th>From</th>
              <th>To</th>
              <th></th>
            </tr>
          </thead>
          <tbody>{components}</tbody>
        </table>
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
          {/* {modal && (
            <EditStudent
              update={getData}
              prevStudent={selecStudent}
              clicked={toggleModal}
            />
          )} */}
        </div>
      ) : (
        <p className="errorContainer">
          You are not authorized to access this page you have to login first!
        </p>
      )}
    </>
  );
};
export default Bookings;
