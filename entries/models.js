"use strict";

const mongoose = require("mongoose");

const entrySchema = mongoose.Schema({
  title: { type: String, required: true },
  travelDate: { type: String, required: true },
  coverPhoto: { type: String, required: true },
  description: { type: String, required: true },
  memories: { type: String, required: true },
  words: String,
  morePhotos: Array,
  username: String
});

entrySchema.methods.serialize = function() {
  return {
    id: this._id,
    title: this.title,
    travelDate: this.travelDate,
    coverPhoto: this.coverPhoto,
    description: this.description,
    memories: this.memories,
    words: this.words,
    morePhotos: this.morePhotos,
    username: this.username
  };
};

const Entry = mongoose.model("Entry", entrySchema);
module.exports = { Entry };
