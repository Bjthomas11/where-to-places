"use strict";
// require express
const express = require("express");
// require Entry object from models folder
const { Entry } = require("./models");
// require router for express router
const router = express.Router();
// use middleware that formats express in json
router.use(express.json());
// require passport
const passport = require("passport");
// create jwtAuth with passport and use the router jwtAuth
const jwtAuth = passport.authenticate("jwt", { session: false });
router.use(jwtAuth);

// GET landing page
router.get("/", (req, res) => {
  // find username in Entry object schema
  Entry.find({ username: req.user.username })
    .then(entries => {
      console.log(req.user);
      res.json({
        // map through entries and serialize it
        entries: entries.map(entry => entry.serialize())
      });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    });
});

// GET id
router.get("/:id", (req, res) => {
  // find params id from Entry object schema model
  Entry.findById(req.params.id)
    .then(entry => {
      // if request user is same as Entry model schema username then create json thats serialized
      if (req.user.username === entry.username) {
        res.json(entry.serialize());
      } else {
        // if nothing then return error message
        res.status(401).json({ message: "Not Authorized User" });
      }
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    });
});

//POST landing page
router.post("/", (req, res) => {
  //ensure all the fields are in req body
  const requiredFields = ["title", "travelDate", "coverPhoto"];
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing  ${field} field`;
      console.error(message);
      return res.status(400).send(message);
    }
  }
  // create Entry schema with fields
  Entry.create({
    username: req.user.username,
    title: req.body.title,
    travelDate: req.body.travelDate,
    coverPhoto: req.body.coverPhoto
  })
    .then(entry => res.status(201).json(entry.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    });
});

// PUT by id
router.put("/:id", (req, res) => {
  // id in the request path and the request body are the same
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    const message = `Request path id (${req.params.id}) and request body id
    (${req.body.id}) must match`;
    console.error(message);
    return res.status(400).json({ message: message });
  }
  // create updated empty object
  const toUpdate = {};
  const updateableFields = ["title", "travelDate", "coverPhoto"];
  updateableFields.forEach(field => {
    if (field in req.body) {
      console.log(req.body.field);
      toUpdate[field] = req.body[field];
    }
  });
  // find params id in Entry schema model
  Entry.findById(req.params.id)
    .then(function(entry) {
      // if request user is same as Entry schema model username
      if (req.user.username === entry.username) {
        // take Entry model and find by id and update the params id then return status
        Entry.findByIdAndUpdate(req.params.id, { $set: toUpdate }).then(entry =>
          res.status(204).end()
        );
      } else {
        // if nothing then send back an error message
        res.status(401).json({ message: "Not Authorized User" });
      }
    })
    .catch(err => res.status(500).json({ message: "Internal server error" }));
});

// DELETE by certain id
router.delete("/:id", (req, res) => {
  // find params id by Entry model
  Entry.findById(req.params.id)
    .then(function(entry) {
      // if request user is same and entry schema model username
      if (req.user.username === entry.username) {
        // find the params id in the Entry model and remove the id and return status and end it
        Entry.findByIdAndRemove(req.params.id).then(entry =>
          res.status(204).end()
        );
      } else {
        // if nothing hapoens then return error message
        res.status(401).json({ message: "Not Authorized User" });
      }
    })
    .catch(err => res.status(500).json({ message: "Internal server error" }));
});
// export router object
module.exports = { router };
