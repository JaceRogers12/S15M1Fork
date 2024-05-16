// Require the `restricted` middleware from `auth-middleware.js`. You will need it here!
/**
  [GET] /api/users
  This endpoint is RESTRICTED: only authenticated clients
  should have access.
  response:
  status 200
  [{"user_id": 1, "username": "bob"}, // etc ]
  response on non-authenticated:
  status 401
  {"message": "You shall not pass!"}
 */
// Don't forget to add the router to the `exports` object so it can be required in other modules

const express = require("express");
const Users = require("./users-model.js");
const {
  restricted
} = require("../auth/auth-middleware.js");

const router = express.Router();

router.get("/", restricted, async (req, res, next) => {
  const users = await Users.find();
  try {
    res.status(200).json(users);
  } catch(err) {
    next({status: 500, message: "There was an issue retrieving the users"});
  }
})

module.exports = router;