const Users = require("../users/users-model.js");
/*
  If the user does not have a session saved in the server
  status 401
  {"message": "You shall not pass!"}
*/
async function restricted(req, res, next) {
  console.log("checking for valid session");
  next();
}

/*
  If the username in req.body already exists in the database
  status 422
  {"message": "Username taken"}
*/
async function checkUsernameFree(req, res, next) {
  console.log("checking if username is already in database")
  next();
}

/*
  If the username in req.body does NOT exist in the database
  status 401
  {"message": "Invalid credentials"}
*/
async function checkUsernameExists(req, res, next) {
  console.log("checking if username is authorized")
  next();
}

/*
  If password is missing from req.body, or if it's 3 chars or shorter
  status 422
  {"message": "Password must be longer than 3 chars"}
*/
async function checkPasswordLength(req, res, next) {
  console.log("checking if password is valid")
  next();
}

// Don't forget to add these to the `exports` object so they can be required in other modules
module.exports = {
  restricted,
  checkUsernameFree,
  checkUsernameExists,
  checkPasswordLength
}