const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const dbConnect = require("./db/dbConnect");
const User = require("./db/userModel");
const Students = require("./db/studentModel");
const Facility = require("./db/facilityModel");
const Bookings = require("./db/bookingsModel");
const Announcement = require("./db/announcemnetModel");

// execute database connection
dbConnect();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

// body parser configuration
app.use(bodyParser.json({ limit: "400kb" }));
app.use(bodyParser.urlencoded({ extended: true }));

// create new student
app.post("/students/create", async (request, response) => {
  try {
    const {
      User_ID,
      User_Email,
      Full_Name,
      SecretQuestion,
      AnswerQuestion,
      Password,
      User_Gender,
    } = request.body;

    // Check if user already has an account
    const existingUser = await Students.findOne({ User_ID });
    if (existingUser) {
      return response.status(200).json({
        message: "Duplicate",
      });
    } else {
      const hashedPassword = await bcrypt.hash(Password, 10);

      const student = new Students({
        User_ID: User_ID,
        User_Email: User_Email,
        Full_Name: Full_Name,
        SecretQuestion: SecretQuestion,
        AnswerQuestion: AnswerQuestion,
        Password: hashedPassword,
        ConfirmPassword: hashedPassword,
        User_Gender: User_Gender,
        User_status: "active",
      });

      await student.save();

      response.status(200).json({
        message: "successful",
      });
    }
  } catch (error) {
    response.status(500).json({
      message: "Error creating new student",
      error: error.message,
    });
  }
});

// delete student account
app.delete("/students/delete/:id", (request, response) => {
  const studentID = request.params.id;

  Students.findOneAndDelete({ _id: studentID })
    .then((deletedStudent) => {
      if (!deletedStudent) {
        return response.status(404).send({
          data: "Student not found",
        });
      }
      response.status(200).send({
        data: "Deleted",
      });
    })
    .catch((err) => {
      response.status(500).send({
        Error: err.message,
        data: "Error",
      });
    });
});

// retrive all students data
app.get("/api/students", (request, response) => {
  Students.find({})
    .then((data) => {
      response.status(200).json({
        message: "the following are students data in the database: ",
        data: data,
      });
    })
    .catch((error) => {
      response.status(500).send({
        message: "the following error occurred: ",
        error: error,
      });
    });
});

// retrieve a particular student info
app.get("/api/students/:id", (request, response) => {
  const id = request.params.id;

  Students.find({ _id: id })
    .then((data) => {
      response.status(200).json({
        message: "the following are student's data in the database: ",
        data: data,
      });
    })
    .catch((error) => {
      response.status(500).send({
        message: "the following error occurred: ",
        error: error,
      });
    });
});

// update the status of the student
app.put("/students/:id", (request, res) => {
  const id = request.params.id;

  Students.findByIdAndUpdate(
    id,
    {
      User_ID: request.body.User_ID,
      User_Email: request.body.User_Email,
      Full_Name: request.body.Full_Name,
      SecretQuestion: request.body.SecretQuestion,
      AnswerQuestion: request.body.AnswerQuestion,
      Password: request.body.Password,
      ConfirmPassword: request.body.Password,
      User_Gender: request.body.User_Gender,
      User_status: request.body.User_status,
    },
    { new: true }
  )
    .then((student) => {
      res.json(student);
    })
    .catch((error) => {
      res
        .status(502)
        .json({ message: "Error updating student status!", error: error });
    });
});

// update student's information from mobile app
app.put("/students/update/:id", (request, res) => {
  const id = request.params.id;

  Students.findByIdAndUpdate(
    id,
    {
      Full_Name: request.body.Full_Name,
      AnswerQuestion: request.body.AnswerQuestion,
      User_Gender: request.body.User_Gender,
      User_Email: request.body.User_Email,
    },
    { new: true }
  )
    .then((student) => {
      res.json(student);
    })
    .catch((error) => {
      res
        .status(502)
        .json({ message: "Error updating student status!", error: error });
    });
});

// student loign
app.post("/students/login", (request, response) => {
  // check if student is exist in the system
  Students.findOne({ User_ID: request.body.User_ID })
    .then((student) => {
      if (student) {
        bcrypt
          // check if the user's password match the provided password
          .compare(request.body.Password, student.Password)
          .then((passwordCheck) => {
            if (passwordCheck) {
              response.status(200).send({
                message: "Login Successful",
                student: student,
              });
            } else {
              response.status(400).send({
                message: "Password is incorrect!",
              });
            }
          })
          .catch((error) => {
            response.status(500).send({
              message: "An error occurred while comparing passwords",
              error,
            });
          });
      } else {
        response.status(404).send({
          message: "User ID not found",
        });
      }
    })
    .catch((error) => {
      response.status(500).send({
        message: "An error occurred while searching for the user",
        error,
      });
    });
});

// reset password for studnets
app.post("/students/resetPassword", (request, response) => {
  const { User_ID, AnswerQuestion } = request.body;

  // check if the user is exist in the system
  Students.findOne({ User_ID })
    .then((student) => {
      if (student) {
        // check if the user's answer question match provided answer
        if (student.AnswerQuestion === AnswerQuestion) {
          response.status(200).send({
            message: "Successful",
          });
        } else {
          response.status(400).send({
            message: "The answer is incorrect!",
          });
        }
      } else {
        response.status(404).send({
          message: "User ID not found",
        });
      }
    })
    .catch((error) => {
      response.status(500).send({
        message: "An error occurred while searching for the user",
        error,
      });
    });
});

// update student's password in the database after resetting the password
app.post("/students/updatePassword", (request, response) => {
  const { User_ID, Password, ConfirmPassword } = request.body;

  if (Password !== ConfirmPassword) {
    response.status(400).send({
      message: "Passwords do not match!",
    });
    return;
  }

  Students.findOne({ User_ID })
    .then((student) => {
      if (student) {
        bcrypt.hash(Password, 10).then((hashedPassword) => {
          student.Password = hashedPassword;
          student.ConfirmPassword = hashedPassword;

          student
            .save()
            .then(() => {
              response.status(200).send({
                message: "Password updated successfully",
              });
            })
            .catch((error) => {
              response.status(500).send({
                message: "Error updating password",
                error,
              });
            });
        });
      } else {
        response.status(404).send({
          message: "User ID not found",
        });
      }
    })
    .catch((error) => {
      response.status(500).send({
        message: "An error occurred while searching for the user",
        error,
      });
    });
});

// create new booking
app.post("/bookings/create", (request, response) => {
  const booking = new Bookings({
    studentID: request.body.studentID,
    facilityID: request.body.facilityID,
    studentName: request.body.studentName,
    facilityName: request.body.facilityName,
    slot_ID: request.body.slot_ID,
    slotTime: request.body.slotTime,
    slotDate: request.body.slotDate,
    slotDay: request.body.slotDay,
    status: "new",
  });

  booking
    .save()
    .then((result) => {
      response.status(201).send({
        message: "Booking is added successfully!",
        result,
      });
    })
    .catch((error) => {
      response.status(500).send({
        message: "Error inserting the booking to the system",
        error: error.message,
      });
    });
});

// retrieve all bookings information in the database
app.get("/api/bookings", (request, response) => {
  Bookings.find({})
    .then((data) => {
      response.status(200).json({
        message: "the following are students bookings database: ",
        data: data,
      });
    })
    .catch((error) => {
      response.status(500).send({
        message: "the following error occurred: ",
        error: error,
      });
    });
});

// delete a specific facility booking
app.delete("/bookings/delete/:id", (request, response) => {
  const bookingID = request.params.id;

  Bookings.findOneAndDelete({ _id: bookingID })
    .then((deletedBooking) => {
      if (!deletedBooking) {
        return response.status(404).send({
          data: "Booking not found",
        });
      }
      response.status(200).send({
        data: "Deleted",
      });
    })
    .catch((err) => {
      response.status(500).send({
        Error: err.message,
        data: "Error",
      });
    });
});

// update the status of the booking
app.put("/bookings/status/:id", (req, res) => {
  const id = req.params.id;

  Bookings.findOneAndUpdate(
    { _id: id },
    {
      $set: {
        status: req.body.status,
      },
    },
    { new: true, useFindAndModify: false }
  )
    .then((booking) => {
      res.json(booking);
    })
    .catch((error) => {
      res
        .status(500)
        .json({ message: "Error updating booking status!", error: error });
    });
});

// create a new facility
app.post("/facility/create", (request, response) => {
  Facility.findOne({ name: request.body.name })

    // if there is another facility with the same name
    .then((result) => {
      if (result) {
        response.status(200).send({
          message: "there is another facility with the same name",
        });
      } else {
        const facility = new Facility({
          name: request.body.name,
          description: request.body.description,
          image: request.body.image,
          rating: [],
          reservationTimes: [],
          location: request.body.location,
        });
        facility
          .save()
          // return success if the new facility is added to the database successfully
          .then((result) => {
            response.status(201).send({
              message: "facility hass been Created Successfully",
              result,
            });
          })
          // catch erroe if the new facility wasn't added successfully to the database
          .catch((error) => {
            response.status(500).send({
              message: "Error creating new facility",
              error,
            });
          });
      }
    })
    .catch((error) => {
      response.status(400).send({
        message: "",
        error,
      });
    });
});

// retrive all facilities data in the database
app.get("/api/facility", (request, response) => {
  Facility.find({})
    .then((data) => {
      response.status(200).json({
        message: "the following are facilities data in the database: ",
        data: data,
      });
    })
    .catch((error) => {
      response.status(500).send({
        message: "the following error occurred: ",
        error: error,
      });
    });
});

// retrive a specific facility info by its id
app.get("/facilities/:id", (request, response) => {
  Facility.findOne({ _id: request.params.id })
    .then((result) => {
      if (result) {
        response.status(200).send({
          message:
            "the following is the info of the facility with provided id:",
          data: result,
        });
      } else {
        response.status(201).send({
          message: "there is no any facility with provided id:",
        });
      }
    })
    // catch error if password do not match
    .catch((error) => {
      response.status(400).send({
        message: "",
        error,
      });
    });
});

// update specefic facility's info
app.put("/facility/:id", (req, res) => {
  const id = req.params.id;
  const { name, description, image } = req.body;

  Facility.findByIdAndUpdate(
    id,
    {
      name: name,
      description: description,
      image: image,
    },
    { new: true }
  )
    .then((facility) => {
      res.json(facility);
    })
    .catch((error) => {
      res
        .status(500)
        .json({ message: "Error updating facility!", error: error });
    });
});

// update specific facility calender from mobile app
app.put("/facilities/update/:id", (request, res) => {
  const id = request.params.id;
  const updatedCalendar = request.body.calendar;

  Facility.findOneAndUpdate(
    { _id: id },
    {
      $set: {
        calendar: updatedCalendar,
      },
    },
    { new: true, useFindAndModify: false }
  )
    .then((facility) => {
      res.json(facility);
    })
    .catch((error) => {
      res
        .status(502)
        .json({ message: "Error updating facility's calendar!", error: error });
    });
});

// update specific facility's rating from mobile app
app.put("/facilities/updateRating/:id", (request, res) => {
  const id = request.params.id;
  const userID = request.body.userID;
  const rating = request.body.rating;

  Facility.findOne({ _id: id })
    .then((facility) => {
      if (!facility) {
        throw new Error("Facility not found.");
      }

      // verifying if the student will provided id already rate the facility
      const existingRating = facility.rating.find((r) => r.userID === userID);
      if (existingRating) {
        // update the value of rating stars
        existingRating.value = rating;
      } else {
        // inset a new rating to the facility
        facility.rating.push({ userID, value: rating });
      }

      return facility.save();
    })
    .then((updatedFacility) => {
      res.json(updatedFacility);
    })
    .catch((error) => {
      res
        .status(502)
        .json({ message: "Error updating facility's rating!", error: error });
    });
});

// update number of facility's users
app.put("/facilities/updateUsage/:id", (request, res) => {
  const id = request.params.id;
  const userID = request.body.userID;
  const date = request.body.date;

  Facility.findOne({ _id: id })
    .then((facility) => {
      if (!facility) {
        throw new Error("Facility not found.");
      }

      facility.reservationTimes.push({ userID: userID, date: date });

      return facility.save();
    })
    .then((updatedFacility) => {
      res.json(updatedFacility);
    })
    .catch((error) => {
      res.status(502).json({
        message: "Error updating facility's reservation Times!",
        error: error,
      });
    });
});

// update facility's calendar
app.put("/facility/:id/timeTable", (req, res) => {
  const id = req.params.id;
  const { duration, availableTo, availableFrom, selectedDays, calendar } =
    req.body;
  Facility.findByIdAndUpdate(
    { _id: id },
    {
      availableFrom: availableFrom,
      availableTo: availableTo,
      duration: duration,
      selectedDays: selectedDays,
      calendar: calendar,
    },
    { new: true }
  )
    .then((facility) => {
      res.json(facility);
    })
    .catch((error) => {
      res
        .status(500)
        .json({ message: "Error updating facility!", error: error });
    });
});

// remove a facility reservation from facility utilization array
app.delete(
  "/facility/deleteReservation/:id/:studentId",
  (request, response) => {
    const facilityId = request.params.id;
    const studentId = request.params.studentId;

    Facility.findOneAndUpdate(
      { _id: facilityId },
      { $pull: { reservationTimes: { userID: studentId } } },
      { new: true }
    )
      .then((updatedFacility) => {
        if (!updatedFacility) {
          response.status(404).send({
            message: "Facility not found",
          });
          return;
        }
        response.status(200).send({
          message: "Reservation deleted",
        });
      })
      .catch((error) => {
        response.status(500).send({
          message: "Error deleting reservation",
          error: error.message,
        });
      });
  }
);

// delete a particular facility
app.delete("/facility/delete/:id", (request, response) => {
  const id = request.params.id;

  Facility.deleteOne(
    {
      _id: id,
    },
    function (err) {
      console.log(err);
    }
  )
    .then(() => {
      response.status(200).send({
        data: "Deleted",
      });
    })
    .catch((err) => {
      response.status(500).send({
        Error: err.message,
        data: "Error",
      });
    });
});

// create a new announcement
app.post("/announcement", (request, response) => {
  const announcement = new Announcement({
    title: request.body.title,
    content: request.body.content,
    image: request.body.image,
  });
  announcement
    .save()
    .then((result) => {
      response.status(201).send({
        message: "announcement Created Successfully",
        result,
      });
    })
    .catch((error) => {
      response.status(500).send({
        message: "Error creating announcement",
        error,
      });
    });
});

// retrive all announcements data form database
app.get("/api/announcements", (request, response) => {
  Announcement.find({})
    .then((data) => {
      response.status(200).json({
        message: "the following are announcement data in the database: ",
        data: data,
      });
    })
    .catch((error) => {
      response.status(500).send({
        message: "the following error occurred: ",
        error: error,
      });
    });
});

// update announcement's content
app.put("/announcement/:id", (req, res) => {
  const id = req.params.id;
  const { title, content, image } = req.body;

  Announcement.findByIdAndUpdate(
    id,
    {
      title: title,
      content: content,
      image: image,
    },
    { new: true }
  )
    .then((announcement) => {
      res.json(announcement);
    })
    .catch((error) => {
      res
        .status(500)
        .json({ message: "Error updating announcement!", error: error });
    });
});

// delete a particular announcement from the database
app.delete("/announcement/delete/:id", (request, response) => {
  const id = request.params.id;
  Announcement.deleteOne(
    {
      _id: id,
    },
    function (err) {
      console.log(err);
    }
  )
    .then(() => {
      response.status(200).send({
        data: "Deleted",
      });
    })
    .catch((err) => {
      response.status(500).send({
        Error: err.message,
        data: "Error",
      });
    });
});

// admin registration endpoint
app.post("/register", (request, response) => {
  // hash the password
  console.log("hello");
  bcrypt
    .hash(request.body.password, 10)
    .then((hashedPassword) => {
      // create a new user instance and collect the data
      const user = new User({
        User_ID: request.body.User_ID,
        password: hashedPassword,
      });
      user
        .save()
        // return success if the new user is added to the database successfully
        .then((result) => {
          response.status(200).send({
            message: "User Created Successfully",
            result,
          });
        })
        // catch erroe if the new user wasn't added successfully to the database
        .catch((error) => {
          response.status(500).send({
            message: "Error creating user",
            error,
          });
        });
    })
    // catch error if the password hash isn't successful
    .catch((e) => {
      response.status(500).send({
        message: "Password was not hashed successfully",
        e,
      });
    });
});

// admin login endpoint
app.post("/login", (request, response) => {
  // check if user_ID exists
  User.findOne({ User_ID: request.body.User_ID })

    // if email exists
    .then((user) => {
      // compare the password entered and the hashed password found
      bcrypt
        .compare(request.body.password, user.password)

        // if the passwords match
        .then((passwordCheck) => {
          if (!passwordCheck) {
            return response.status(400).send({
              message: "Passwords does not match",
              error,
            });
          }

          //   create JWT token
          const token = jwt.sign(
            {
              userId: user._id,
              user_ID: user.User_ID,
            },
            "RANDOM-TOKEN",
            { expiresIn: "24h" }
          );

          //   return success response
          response.status(200).send({
            message: "Login Successful",
            User_ID: user.User_ID,
            token,
          });
        })
        // catch error if password do not match
        .catch((error) => {
          response.status(400).send({
            message: "Passwords does not match",
            error,
          });
        });
    })
    // catch error if email does not exist
    .catch((e) => {
      response.status(404).send({
        message: "User ID not found",
        e,
      });
    });
});

module.exports = app;
