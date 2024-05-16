const Users = require("../users/users-model.js");
/*
  If the user does not have a session saved in the server
  status 401
  {"message": "You shall not pass!"}
*/
async function restricted(req, res, next) {
  //console.log("checking for valid session");
  let pass = req.session;
  if (!pass || !pass.user) {
    res.status(401).json({message: "You shall not pass!"});
  } else {
    next();
  }
}

/*
  If the username in req.body already exists in the database
  status 422
  {"message": "Username taken"}
*/
async function checkUsernameFree(req, res, next) {
  //console.log("checking if username is already in database");
  let {username} = req.body;
  let [taken] = await Users.findBy({username});
  try {
    if (taken) {
      res.status(422).json({message: "Username taken"});
    } else {
      next();
    }
  } catch(err) {
    next({status: 500, message: "checkUsernameFree had an error"});
  }
  
}

/*
  If the username in req.body does NOT exist in the database
  status 401
  {"message": "Invalid credentials"}
*/
async function checkUsernameExists(req, res, next) {
  //console.log("checking if username is authorized");
  let {username} = req.body;
  let exists = await Users.findBy({username});
  try {
    if (!exists) {
      res.status(401).json({message: "Invalid credentials"})
    } else {
      next();
    }
  } catch(err) {
    next({status: 500, message: "checkUsernameExists had an error"});
  }
}

/*
  If password is missing from req.body, or if it's 3 chars or shorter
  status 422
  {"message": "Password must be longer than 3 chars"}
*/
function checkPasswordLength(req, res, next) {
  //console.log("checking if password is valid");
  let {password} = req.body;
  if (!password || password.length <= 3) {
    res.status(422).json({message: "Password must be longer than 3 chars"})
  } else {
    next();
  }
}

// Don't forget to add these to the `exports` object so they can be required in other modules
module.exports = {
  restricted,
  checkUsernameFree,
  checkUsernameExists,
  checkPasswordLength
}