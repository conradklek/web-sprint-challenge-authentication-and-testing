const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'shh';
module.exports = (req, res, next) => {
  /*
    IMPLEMENT

    1- On valid token in the Authorization header, call next.

    2- On missing token in the Authorization header,
      the response body should include a string exactly as follows: "token required".

    3- On invalid or expired token in the Authorization header,
      the response body should include a string exactly as follows: "token invalid".
  */
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    res.status(401).json({ message: 'token required' });
  } else {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, JWT_SECRET, (err, decodedToken) => {
      if (err) {
        res.status(401).json({ message: 'token invalid' });
      }
      req.decodedToken = decodedToken;
      next();
    });
  }
};
