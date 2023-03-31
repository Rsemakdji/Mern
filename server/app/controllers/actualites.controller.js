const db = require("../models");
const Actualites = db.actualites;


// Create and Save a new informations
exports.create = (req, res) => {
  // Validate request
  if (!req.body.title) {
    res.status(400).send({ message: "actualites cant be empty!" });
    return;
  }

  // Create a actualites
  const actualites = new Actualites({
    title: req.body.title,
    description: req.body.description,
  });

  // Save actualites in the database
  actualites
    .save(actualites)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the actualites."
      });
    });
};


// Retrieve all actualites from the database.
exports.findAll = (req, res) => {
  const id = req.query.id;
  var condition = id ? { id: { $regex: new RegExp(title), $options: "i" } } : {};

  Actualites.find(condition)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving actualites."
      });
    });
};
// Find a single actualites with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Actualites.findById(id)
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found actualites with id " + id });
      else res.send(data);
    })
    .catch(err => {
      res
        .status(500)
        .send({ message: "Error retrieving actualites with id=" + id });
    });
};

// Update a actualites by the id in the request
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }

  const id = req.params.id;

  Actualites.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update infos with id=${id}. Maybe actualites was not found!`
        });
      } else
        res.send({ message: "actualites was updated successfully." });
    })
    .catch(err => {
      res.status(500).send({
        message: `Error updating actualites with id=${id}`
      });
    });
};

// Delete a actualites with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Actualites.findByIdAndRemove(id, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete actualites with title=${title}. Maybe actualites was not found!`
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
  Actualites.deleteMany({})
    .then(data => {
      res.send({
        message: `${data.deletedCount} actualites were deleted successfully!`
      });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all actualites."
      });
    });
};