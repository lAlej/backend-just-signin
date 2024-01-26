const express = require("express");
const router = express.Router();
const { loginUser } = require("../controllers/users");

router.get("/", loginUser)

module.exports = router;