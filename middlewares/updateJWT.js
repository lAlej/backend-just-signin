
const jwt = require("jsonwebtoken");
const mysql = require("mysql2/promise");

const updateJWT = (jwt, username) => {
  mysql.createConnection({
    host: process.env.HOST_TOKEN,
    user: "root",
    port: 21751,
    password: process.env.PASSWORD_TOKEN,
    database: process.env.DATABASE_TOKEN,
  })
  .then((conn) => 
    conn.query(`UPDATE users_login SET jwt = ? WHERE username = ?`, [jwt, username])
  )
  .then(async ([rows, field]) => {
    return true
  })
  .catch((err) => {
    return err
  })
}

module.exports = {updateJWT}