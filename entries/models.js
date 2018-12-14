"use strict";
// require mongoose for mongo
const mongoose = require("mongoose");
// create mongoose schema with fields
const entrySchema = mongoose.Schema({
  title: { type: String, required: true },
  travelDate: { type: String, required: true },
  coverPhoto: { type: String, required: true },
  username: String
});
// take mongoose schema with methods and serialize it the return the fields in an object
entrySchema.methods.serialize = function() {
  return {
    id: this._id,
    title: this.title,
    travelDate: this.travelDate,
    coverPhoto: this.coverPhoto,
    username: this.username
  };
};
// create variable with mongoose model name and mongoose schema
const Entry = mongoose.model("Entry", entrySchema);
// export Entry variable that holds the mongoose schema
module.exports = { Entry };
