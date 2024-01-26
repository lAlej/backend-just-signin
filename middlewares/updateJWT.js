
const jwt = require("jsonwebtoken");
const mysql = require("mysql2/promise");

const updateJWT = (jwt, username) => {
  mysql.createConnection({
    host: "sql3.freemysqlhosting.net",
    user: "sql3678855",
    port: 3306,
    password: "paV24S5Kl2",
    database: "sql3678855",
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