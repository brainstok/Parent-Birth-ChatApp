const express = require("express");
const router = express.Router();
const { handleGetDoulas } = require("../../controllers/doulas");

router.get("/", async (req, res) => {
  try {
    const doulas = await handleGetDoulas(req.query);
    res.status(200).json(doulas);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "Unable to get doulas" });
  }
});

module.exports = router;
