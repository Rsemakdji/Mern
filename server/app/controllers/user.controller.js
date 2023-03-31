const db = require("../models");
const User = db.users;
const jsonwebtoken = require('jsonwebtoken');
const { jwtSecret } = require("../config/jwt.config");


exports.getInfo = async (req, res) => {
  if (!req.user)
    return res.status(401).send({ error: "problème d'authentification de l'utilisateur" });

  return res.send({
    isAdmin: req.user.isAdmin,
    email: req.user.email,
  });
};

// Log user and create JWT token
exports.login = (req, res) => {
  
  console.log(req.body);

  User.find({ email: req.body.email }).then((data) => {
    console.log(data);

    // user trouvé
    if (data.length > 0) {

      const user = data[0];
      // password match
      if (user.password === req.body.password) {

        const token = jsonwebtoken.sign(
          {
            email: user.email,
            isAdmin: user.isAdmin,
          }, // payload
          jwtSecret // secret
        );

        res.send({ token });
      }

      // mauvais password
      else {
        res.status(401).send({
          errors: {
            password: "mauvais mot de passe"
          }
        });
      }
    }

    // user pas trouvé
    else {
      res.status(409).send({
        errors: {
          email: "utilisateur non trouvé"
        }
      });
    }
  });
};

// Create and Save a new User
exports.signup = async (req, res) => {
  // Validate request

  const errors = {};

  if (!req.body.lastname) {
    res.status(400).send({ message: "Name cant not be empty!" });
    return;
  }

  // vérification de l'existence de l'utilisateur en base (par le mail)
  const data = await User.find({ email: req.body.email });

  if (data.length > 0) {
    // https://stackoverflow.com/questions/3825990/http-response-code-for-post-when-resource-already-exists

    errors.email = "désolé mais le mail existe déjà";
    return res.status(409).send(errors);

  }


  // verificaton Admin 

  const getInfo = await User.find({ isAdmin: req.body.isAdmin });

  if (getInfo.length > 0) {
    errors.isAdmin = "vous n'avez pas les droit nécessaire ";
    return res.status(409).send(errors);

  }


  // Create a User


  const user = new User({
    lastname: req.body.lastname,
    firstname: req.body.firstname,
    email: req.body.email,
    phone: req.body.phone,
    address: req.body.address,
    city: req.body.city,
    postal: req.body.postal,
    password: req.body.password,
    isAdmin: false,
  });


  // Save User in the database
  user
    .save(user)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the User."
      });
    });
};

// Retrieve all Users from the database.
exports.findAll = (req, res) => {
  User.find({})
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving users."
      });
    });
};

// Find a single User with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  User.findById(id)
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found User with id " + id });
      else {
        const foundUser = {
          lastname : data.lastname,
          firstname : data.firstname,
          email : data.email,
          phone : data.phone,
          address : data.address,
          city : data.city,
          postal : data.postal,
        }
        res.send(foundUser);
      }
    })
    .catch(err => {
      res
        .status(500)
        .send({ message: "Error retrieving User with id=" + id });
    });
};

// Update a User by the id in the request
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }

  const id = req.params.id;
  const editedUser = {
    lastname : req.body.lastname,
    firstname : req.body.firstname,
    email : req.body.email,
    phone : req.body.phone,
    address : req.body.address,
    city : req.body.city,
    postal : req.body.postal,
  };

  User.findByIdAndUpdate(id, editedUser, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update User with id=${id}. Maybe User was not found!`
        });
      } else res.send({ message: "User was updated successfully." });
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating User with id=" + id
      });
    });
};

// Delete a User with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  User.findByIdAndRemove(id, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete User with id=${id}. Maybe User was not found!`
        });
      } else {
        res.send({
          message: "User was deleted successfully!"
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete User with id=" + id
      });
    });
};

// Delete all Users from the database.
exports.deleteAll = (req, res) => {
  
  User.deleteMany({})
    .then(data => {
      res.send({
        message: `${data.deletedCount} Users were deleted successfully!`
      });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all users."
      });
    });
};
