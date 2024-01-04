import jwt from "jsonwebtoken";

const checkToken = (token, secret) => {
  try {
    const decodedToken = jwt.verify(token, secret);
    if (decodedToken.exp * 1000 < Date.now()) {
      return true;
    } else {
      return false;
    }
  } catch (e) {
    return true;
  }
};

module.exports = checkToken;