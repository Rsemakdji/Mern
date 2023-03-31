const db = require("../models");
const Informations = db.informations;


// Create and Save a new informations
exports.create = (req, res) => {
  // Validate request
  if (!req.body.title) {
    res.status(400).send({ message: "informations can not be empty!" });
    return;
  }

  // Create a Informations
  const informations = new Informations({
    title: req.body.title,
    description: req.body.description,
  });

  // Save informations in the database
  informations
    .save(informations)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the informations."
      });
    });
};


// Retrieve all informations from the database.
exports.findAll = (req, res) => {
  const id = req.query.id;
  var condition = id ? { id: { $regex: new RegExp(id), $options: "i" } } : {};

  Informations.find(condition)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving informations."
      });
    });
};
// Find a single informations with an title
exports.findOne = (req, res) => {

  const id = req.params.id;

  Informations.findById(id)
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found information with title " + title });
      else res.send(data);
    })
    .catch(err => {
      res
        .status(500)
        .send({ message: "Error retrieving informations with title=" + title });
    });
};

// Update a informations by the id in the request
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }

  const id = req.params.id;

  Informations.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update infos with title=${title}. Maybe informations was not found!`
        });
      } else res.send({ message: "informations was updated successfully." });
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating informations with title=" + title
      });
    });
};

// Delete a informations with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Informations.findByIdAndRemove(id, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete infos with title=${title}. Maybe informations was not found!`
        });
      } else {
        res.send({
          message: "informations was deleted successfully!"
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete infos with title=" + title
      });
    });
};

// Delete all informations from the database.
exports.deleteAll = (req, res) => {
  Informations.deleteMany({})
    .then(data => {
      res.send({
        message: `${data.deletedCount} Informations were deleted successfully!`
      });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all informations."
      });
    });
};