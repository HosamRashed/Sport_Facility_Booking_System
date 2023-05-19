const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// require database connection
const dbConnect = require("./db/dbConnect");
const User = require("./db/userModel");
const Students = require("./db/studentModel");
const Facility = require("./db/facilityModel");
const Announcement = require("./db/announcemnetModel");

// execute database connection
dbConnect();

// Curb Cores Error by adding a header here
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
var os = require("os");

var networkInterfaces = os.networkInterfaces();

console.log(networkInterfaces);

// create new student
app.post("/students/create", (request, response) => {
  Students.findOne({ User_ID: request.body.User_ID })
    .then((result) => {
      console.log(result);
      if (result) {
        response.status(200).send({
          message: "Duplicate",
        });
      } else {
        bcrypt
          .hash(request.body.Password, 10) // Hash the password
          .then((hashedPassword) => {
            const student = new Students({
              User_ID: request.body.User_ID,
              Full_Name: request.body.Full_Name,
              SecretQuestion: request.body.SecretQuestion,
              AnswerQuestion: request.body.AnswerQuestion,
              Password: hashedPassword, // Assign the hashed password
              ConfirmPassword: hashedPassword,
              User_Gender: request.body.User_Gender,
              User_status: "active",
            });
            student
              .save()
              .then((result) => {
                console.log("successful"),
                  response.status(200).send({
                    message: "successful",
                  });
              })
              .catch((error) => {
                response.status(500).send({
                  message: "Error creating new student user",
                  error,
                });
              });
          })
          .catch((error) => {
            response.status(500).send({
              message: "Password was not hashed successfully",
              error,
            });
          });
      }
    })
    .catch((error) => {
      response.status(501).send({
        message: "Error with findOne function!",
        error,
      });
    });
});

// retrive students data
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

app.get("/", (request, response) => {
  response.status(200).json({
    message: "the following are students data in the database: ",
  });
});

// update the status of the student
app.put("/students/:id", (request, res) => {
  const id = req.params.id;

  Students.findByIdAndUpdate(
    id,
    {
      User_ID: request.body.User_ID,
      Full_Name: request.body.Full_Name,
      SecretQuestion: request.body.SecretQuestion,
      AnswerQuestion: request.body.AnswerQuestion,
      Password: request.body.Password,
      ConfirmPassword: request.body.ConfirmPassword,
      User_Gender: request.body.User_Gender,
      User_status: "active",
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

// login endpoint
app.post("/students/login", (request, response) => {
  Students.findOne({ User_ID: request.body.User_ID })
    .then((student) => {
      if (student) {
        bcrypt
          .compare(request.body.Password, student.Password)
          .then((passwordCheck) => {
            if (passwordCheck) {
              response.status(200).send({
                message: "Login Successful",
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

app.post("/students/resetPassword", (request, response) => {
  const { User_ID, AnswerQuestion } = request.body;
  Students.findOne({ User_ID })
    .then((student) => {
      if (student) {
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
          startTime: request.body.startTime,
          endTime: request.body.endTime,
          image: request.body.image,
          reservationTimes: 0,
        });

        facility
          .save()
          // return success if the new user is added to the database successfully
          .then((result) => {
            response.status(201).send({
              message: "facility hass been Created Successfully",
              result,
            });
          })
          // catch erroe if the new user wasn't added successfully to the database
          .catch((error) => {
            response.status(500).send({
              message: "Error creating new facility",
              error,
            });
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

// retrive facility data
app.get("/api/facility", (request, response) => {
  console.log("hello");
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

// update facility
app.put("/facility/:id", (req, res) => {
  const id = req.params.id;
  const { name, description, startTime, endTime, image } = req.body;

  Facility.findByIdAndUpdate(
    id,
    {
      name: name,
      description: description,
      startTime: startTime,
      endTime: endTime,
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

// delete facility
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

// retrive announcements data
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

// update announcement
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

// delete announcement
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

// register endpoint
app.post("/register", (request, response) => {
  console.log("hello");

  // hash the password
  bcrypt
    .hash(request.body.password, 10)
    .then((hashedPassword) => {
      // create a new user instance and collect the data
      const user = new User({
        User_ID: request.body.User_ID,
        password: hashedPassword,
      });

      // save the new user
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

// login endpoint
app.post("/login", (request, response) => {
  // check if email exists
  User.findOne({ User_ID: request.body.User_ID })

    // if email exists
    .then((user) => {
      // compare the password entered and the hashed password found
      bcrypt
        .compare(request.body.password, user.password)

        // if the passwords match
        .then((passwordCheck) => {
          // check if password matches
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

app.post("/facilities", (request, response) => {
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
          location: request.body.location,
          startTime: request.body.startTime,
          endTime: request.body.endTime,
          reservationTimes: 0,
        });

        facility
          .save()
          // return success if the new user is added to the database successfully
          .then((result) => {
            response.status(201).send({
              message: "facility hass been Created Successfully",
              result,
            });
          })
          // catch erroe if the new user wasn't added successfully to the database
          .catch((error) => {
            response.status(500).send({
              message: "Error creating new facility",
              error,
            });
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

module.exports = app;
