const express = require("express");
const Joi = require("joi");
const passport = require("passport");
const router = express.Router();
const {Workout, WorkoutJoiSchema} = require("./models.js");
const jwtAuth = passport.authenticate('jwt', { session: false });

// create(POST)
router.post('/', jwtAuth, (req, res) => {
    // user values into object
    const newWorkout = {
        user: req.user.id,
        title: req.body.title,
        weight: req.body.weight,
        reps: req.body.reps,
        date: Date.now()
    };

    // compare users value with workout schema for correct inputs using Joi
    const validation = Joi.validate(newWorkout, WorkoutJoiSchema);
   // return error if not valid
    if (validation.error) {
        return res.status(404).json({ error: validation.error });
    }

    // create updated session with updated user values
    Workout.create(newWorkout)
        .then(createdWorkout => {
            // return user values serialized json form
            return res.status(201).json(createdWorkout.serialize());
        })
        // return an error if unexpected happens
        .catch(error => {
            return res.status(501).json(error);
        });
});

// retreive(GET)
router.get("/", jwtAuth, (req,res) => {
    // find workouts === same user id
    Workout.find({user: req.user.id})
        // populate-returns the user id
        populate("user")
        .then(workouts => {
            // return users values in serialized json form
            return res.status(200).json(workouts.map(workout => workout.serialize()));
        })
        // return an error if unexpected happens
        .catch(error => {
            return res.status(504).json(error);
        });
});

// retreive all (GET)
router.get("/all", (req,res) => {
    // find all
    Workout.find()
        // populate-returns the user id
        .populate("user")
        .then(workouts => {
            // return users values in serialized json form
            return res.status(200).json(workouts.map(workout => workout.serialize()));
        })
        // return an error if unexpected happens
        .catch(error => {
            return res.status(504).json(error);
        });
});

// retrevie one by id(GET id)
router.get("/:workoutid", (req,res) => {
    // find by id
    Workout.findById(req.params.workoutid)
        // populate-returns the user id
        .populate("user")
        .then(workout => {
            // return users values in serialized json form
            return res.status(200).json(workouts.map(workout => workout.serialize()));
        })
        // return an error if unexpected happens
        .catch(error => {
            return res.status(504).json(error);
        });
})

// remove by id (PUT id)
router.put("/:workoutid", jwtAuth, (req,res) => {
    // create object with users data that needs to be updated
    const workoutUpdate = {
        title: req.body.title,
        weight: req.body.weight,
        reps: req.body.reps
    }
    // compare users value with workout schema for correct inputs using Joi
    const validation = Joi.validate(workoutUpdate, WorkoutJoiSchema);
    if(validation.error){
        return res.status(400).json({error: validation.error});
    }
    // find workout by id and update with new user input
    Workout.findByIdAndUpdate(req.params.workoutid, workoutUpdate)
        .then(() => {
            return res.status(204).end();
        })
        // return an error if unexpected happens
        .catch(error => {
            return res.status(504).json(error);
        });
});

// remove workout by id(DELETE id)
router.delete("/:workoutid", jwtAuth , (req,res) => {
    // find workout by id and remove it
    Workout.findByIdAndDelete(req.params.workoutid)
        .then(() => {
            return res.status(204).end();
        })
        // return an error if unexpected happens
        .catch(error => {
            return res.status(504).json(error);
        });
});

// export router CRUD functions
module.exports = {router};