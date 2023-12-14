const partners = [{ name: "willow", key: "UNBWNRAW9S4KPBTXZFDEK6" }];

const checkApiKey = (req, res, next) => {
  const apiKey = req.headers["authorization"];
  const partner = partners.find((el) => el.key === apiKey);
  if (partner) {
    res.locals.partner = partner.name;
    next();
  } else {
    res.status(403).json("Invalid API Key");
  }
};

module.exports = checkApiKey;
