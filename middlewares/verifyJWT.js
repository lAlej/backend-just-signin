const jwt = require('jsonwebtoken');

const verifyJWT = (req, res, next) => {

  const authHeather = req.headers.authorization || req.headers.Authorization;
  if(!authHeather?.startsWith('Bearer ')) return res.sendStatus(401);
  const token = authHeather.split(' ')[1];

  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET,
    (err, decoded) => {
      if(err) return res.sendStatus(401);
      req.username = decoded.username;
      next();
    }
  )
}

module.exports = verifyJWT