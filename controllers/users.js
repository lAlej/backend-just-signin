const mysql = require("mysql2/promise");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { updateJWT } = require("../middlewares/updateJWT");

const getUser = (req, res) => {
  const id = req.query.id;

  mysql
    .createConnection({
      host: "monorail.proxy.rlwy.net",
      user: "root",
      port: 21751,
      password: "EcBd5E2FehaBcA3d1bf-2eC51EAHecGf",
      database: "just_sign_in",
    })
    .then((conn) =>
      conn.query(
        "SELECT username, first_name, last_name, mail  FROM users_login WHERE jwt = ?",
        [id]
      )
    )
    .then(([rows, field]) => {
      res.json(rows);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Error al obtener los usuarios");
    });
};

const registerUser = async (req, res) => {
  const { username, first_name, last_name, mail, pwd } = req.body;

  const hashedPwd = await bcrypt.hash(pwd, 10);

  const accessToken = jwt.sign(
    {
      UserInfo: {
        username: username,
      },
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "1d" }
  );

  if (!username || !first_name || !last_name || !pwd) {
    res.status(400).json({ message: "All data necesary" });
  } else {
    mysql
      .createConnection({
        host: "monorail.proxy.rlwy.net",
        user: "root",
        port: 21751,
        password: "EcBd5E2FehaBcA3d1bf-2eC51EAHecGf",
        database: "just_sign_in",
      })
      .then((conn) =>
        conn.query(
          `INSERT INTO users_login(username, first_name, last_name, mail, pwd, jwt) VALUES (?, ?, ?, ?, ?, ?)`,
          [username, first_name, last_name, mail, hashedPwd, accessToken]
        )
      )
      .then(async ([rows, field]) => {
        res.cookie("jwt", accessToken, {
          httpOnly: true,
          sameSite: "None",
          maxAge: 2592000,
        });
        res.status(201).json({ data: accessToken });
      })
      .catch((err) => {
        console.log("ERROR: ", err);
        res.status(400).send({ message: "Register error" });
      });
  }
};

const loginUser = async (req, res) => {
  // const{username, pwd} = req.body

  const username = req.query.username;
  const pwd = req.query.pwd;

  if (!username || !pwd) {
    res.status(400).json({ message: "All data necesary" });
  } else {
    mysql
      .createConnection({
        host: "monorail.proxy.rlwy.net",
        user: "root",
        port: 21751,
        password: "EcBd5E2FehaBcA3d1bf-2eC51EAHecGf",
        database: "just_sign_in",
      })
      .then((conn) =>
        conn.query(
          `
          SELECT * FROM users_login WHERE username = ?
          `,
          [username]
        )
      )
      .then(async ([rows, field]) => {

        console.log("rows: ", rows)
        if (rows.length > 0) {
          const hashedPwd = await bcrypt.compare(pwd, rows[0].pwd);

          if (hashedPwd) {
            const accessToken = jwt.sign(
              {
                UserInfo: {
                  username: rows[0].username,
                },
              },
              process.env.ACCESS_TOKEN_SECRET,
              { expiresIn: "1d" }
            );

            await updateJWT(accessToken, rows[0].username);

            res.cookie("jwt", accessToken, {
              httpOnly: true,
              sameSite: "None",
              maxAge: 2592000,
            });

            res.status(201).json(accessToken);
          } else {
            res.sendStatus(401);
          }
        } else {
          console.log("No found");
          res.status(400).send({ message: "Not Found" });
        }
      })
      .catch((err) => {
        console.log("No error");

        console.log("ERROR: ", err);
        res.status(400).send({ message: "Register error" });
      });
  }
};

const updateData = (req, res) => {
  const { username, first_name, last_name, mail } = req.body;
  const user = req.body.username

  mysql
    .createConnection({
      host: "monorail.proxy.rlwy.net",
      user: "root",
      port: 21751,
      password: "EcBd5E2FehaBcA3d1bf-2eC51EAHecGf",
      database: "just_sign_in",
    })
    .then((conn) => 
      conn.query(
        `UPDATE users_login SET mail = ?, first_name = ?, last_name = ? WHERE username = ?`,
        [mail, first_name, last_name, user]
      )
    )
    .then(async ([rows, field]) => {
      res.json(rows);
    })
    .catch((err) => {
      console.log(err);
      res.status(400).send({ message: "ERROR" });
    });
};

module.exports = { getUser, registerUser, loginUser, updateData };
