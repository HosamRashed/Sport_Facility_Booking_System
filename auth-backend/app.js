const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// require database connection
const dbConnect = require("./db/dbConnect");
const User = require("./db/userModel");
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

app.get("/api/facility", (request, response, next) => {
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

// create a new facility
app.post("/facility/create", (request, response) => {
  const facility = new Facility({
    name: request.body.name,
    description: request.body.description,
    startTime: request.body.startTime,
    endTime: request.body.endTime,
    image: request.body.image,
  });

  facility
    .save()
    .then((result) => {
      response.status(201).send({
        message: "facility Created Successfully",
        result,
      });
    })
    .catch((error) => {
      response.status(500).send({
        message: "Error creating facility",
        error,
      });
    });
});

app.post("/facility/delete", (request, response) => {
  Facility.deleteOne(
    {
      _id: request.body.userId,
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

// register endpoint
app.post("/register", (request, response) => {
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
          response.status(201).send({
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
  // check if email exists
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
