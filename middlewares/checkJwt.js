const jwt = require("jsonwebtoken");

const checkJWT = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      throw new Error(401, "Unautorized");
    }

    const user = jwt.verify(token, process.env.JWT_SECRET);

    if (!user || !token) {
      throw new Error(401, "Unautorized");
    }

    req.user = user;
    req.token = token;

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = checkJWT;
