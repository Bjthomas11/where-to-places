"use strict";

const mongoose = require("mongoose");

const entrySchema = mongoose.Schema({
  title: { type: String, required: true },
  travelDate: { type: String, required: true },
  coverPhoto: { type: String, required: true },
  description: { type: String, required: true },
  username: String
});

entrySchema.methods.serialize = function() {
  return {
    id: this._id,
    title: this.title,
    travelDate: this.travelDate,
    coverPhoto: this.coverPhoto,
    description: this.description,
    username: this.username
  };
};

const Entry = mongoose.model("Entry", entrySchema);
module.exports = { Entry };
