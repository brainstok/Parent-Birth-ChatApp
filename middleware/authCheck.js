const jwtCheck = require("./jwtCheck");

const authCheck = (req, res, next) => {
  const apiKey = req.get("PB_API_KEY");
  if (apiKey === process.env.PB_API_KEY) {
    next();
  } else {
    jwtCheck(req, res, next);
  }
};

module.exports = authCheck;
