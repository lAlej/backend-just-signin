const express = require("express");
const router = express.Router();
const { updateData } = require("../controllers/users");

router.post("/", updateData);

module.exports = router;
