// require mongoose (used to make Schema, methods and models)
const mongoose = require("mongoose");
// require joi to make Schema to compare users values from input
const Joi = require("joi");

// model of user workout
const WorkoutScehma = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, ref: 'user' 
    },
    title: {
        type: String,
        required: true
    },
    weight: {
        type: Number, 
        required: true
    },
    reps: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    }
});

// method for workout schema to return id, user, title, weight, reps. date
WorkoutScehma.methods.serialize = function(){
    let user;
    // takes user and formats it into a serialized format if not already
    if(typeof this.user.serialize === "function"){
        user = this.user.serialize();
    } else {
        user = this.user;
    }
    return {
        id: this._id,
        user: user,
        title: this.title,
        weight: this.weight,
        reps: this.reps,
        date: this.date
    }
}

// joi schema model used to compare with mongoose schema model
// const WorkoutJoiSchema = Joi.object().keys({
//     user: Joi.string().optional(),
//     title: Joi.string().min(1).required(),
//     weight: Joi.number().min(1).required(),
//     reps: Joi.number().min(1).required(),
//     date: Joi.date().timestamp
// });

// mongoose model to initialize what db will be named and type of data 
const Workout = mongoose.model("Workout", WorkoutScehma);

// export workout model and joi schema
module.exports = {Workout};