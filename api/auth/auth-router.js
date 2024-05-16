// Require `checkUsernameFree`, `checkUsernameExists` and `checkPasswordLength`
// middleware functions from `auth-middleware.js`. You will need them here!
/**
  1 [POST] /api/auth/register { "username": "sue", "password": "1234" }
  response:
  status 200
  {"user_id": 2, "username": "sue"}
  response on username taken:
  status 422
  {"message": "Username taken"}
  response on password three chars or less:
  status 422
  {"message": "Password must be longer than 3 chars"}
 */
/**
  2 [POST] /api/auth/login { "username": "sue", "password": "1234" }
  response:
  status 200
  {"message": "Welcome sue!"}
  response on invalid credentials:
  status 401
  {"message": "Invalid credentials"}
 */
/**
  3 [GET] /api/auth/logout
  response for logged-in users:
  status 200
  {"message": "logged out"}
  response for not-logged-in users:
  status 200
  {"message": "no session"}
 */
// Don't forget to add the router to the `exports` object so it can be required in other modules

const express = require("express");
const Users = require("../users/users-model.js");
const bcryptjs = require("bcryptjs");
const {
  checkUsernameFree,
  checkUsernameExists,
  checkPasswordLength
} = require("./auth-middleware.js");

const router = express.Router();

router.post("/register", checkUsernameFree, checkPasswordLength, async (req, res, next) => {
  let user = req.body;
  const hash = bcryptjs.hashSync(user.password, 12);
  user.password = hash;
  let newUser = await Users.add(user);
  try {
    res.status(200).json(newUser);
  } catch(err) {
    next(err);
  }
})

router.post("/login", checkUsernameExists, async (req, res, next) => {
  const {username, password} = req.body;
  let [user] = await Users.findBy({username});
  try {
    if (!user || !bcryptjs.compareSync(password, user.password)) {
      res.status(401).json({message: "Invalid credentials"})
    } else {
      req.session.user = user;
      res.status(200).json({message: `Welcome ${user.username}!`})
    }
  } catch(err) {
    next({status: 500, message: "the server had trouble with login"})
  }
})

router.get("/logout", async (req, res, next) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        next({status: 500, message: "There was an issue logging out"})
      } else {
        res.status(200).json({message: "logged out"})
      }
    })
  } else {
    res.status(200).json({message: "no session"})
  }
})

module.exports = router;