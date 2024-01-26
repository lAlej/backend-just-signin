const express = require("express");
const router = express.Router();
const { getUsers, registerUser, loginUser } = require("../controllers/users");

router.get("/users", getUsers);

module.exports = router;
