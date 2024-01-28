
const jwt = require("jsonwebtoken");
const mysql = require("mysql2/promise");

const updateJWT = (jwt, username) => {
  mysql.createConnection({
    host: "monorail.proxy.rlwy.net",
    user: "root",
    port: 21751,
    password: "EcBd5E2FehaBcA3d1bf-2eC51EAHecGf",
    database: "just_sign_in",
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