const jwt = require("express-jwt");
const jwks = require("jwks-rsa");

const jwtCheck = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: "https://robyn.us.auth0.com/.well-known/jwks.json",
  }),
  audience: "https://robyn/api",
  issuer: "https://robyn.us.auth0.com/",
  algorithms: ["RS256"],
});

module.exports = jwtCheck;
