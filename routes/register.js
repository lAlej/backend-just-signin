const express = require("express");
const router = express.Router();
const { registerUser } = require("../controllers/users");

router.post("/", registerUser);

module.exports = router;
