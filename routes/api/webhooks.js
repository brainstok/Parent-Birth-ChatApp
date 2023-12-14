const express = require("express");
const router = express.Router();
const { handleCreatePatient } = require("../../controllers/patients");

const webhookJwtCheck = require("../../middleware/webhookJwtCheck");
// TODO: Plug in middle ware
// webhookJwtCheck,
router.post("/patient", async (req, res) => {
  try {
    const patientInfo = req.body;

    const patient = await handleCreatePatient(patientInfo);
    return res.status(200).send(patient);
  } catch (error) {
    console.log(error.message);
    return res.status(500).send("Unable to sign up patient");
  }
});

module.exports = router;
