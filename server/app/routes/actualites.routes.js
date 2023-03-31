var router = require("express").Router();

const actualites = require("../controllers/actualites.controller.js");


// Create an actualites
router.post("/", actualites.create);

// Retrieve all actualites
router.get("/", actualites.findAll);

// // Retrieve a single actualites with title
router.get("/:id", actualites.findOne);

// // Update a actualites with title
router.put("/:id", actualites.update);

// // Delete a actualites with title
router.delete("/:id", actualites.delete);

// // delete all the actualites
router.delete("/", actualites.deleteAll);

module.exports = router;