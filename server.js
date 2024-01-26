require('dotenv').config();
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const verifyJWT = require('./middlewares/verifyJWT');

const PORT = 3500;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(cookieParser());

// app.use("/", require("./routes/root"))
app.use("/register", require("./routes/register"))
app.use("/login", require("./routes/login"))

app.use(verifyJWT);
app.use("/user", require("./routes/users"))
app.use("/update", require("./routes/update"))

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))

