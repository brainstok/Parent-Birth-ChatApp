const express = require("express");
const Twilio = require("twilio");
const router = express.Router();
const VoiceResponse = Twilio.twiml.VoiceResponse;

// @route POST api/calls
// @desc  Handles incoming calls
// @access Public
router.post("/", async (req, res) => {
  try {
    const twiml = new VoiceResponse();

    twiml.play(
      {},
      "https://robyn-parentbirth-assets.s3.amazonaws.com/parentbirth-vm.mp3"
    );
    res.writeHead(200, { "Content-Type": "text/xml" });
    return res.end(twiml.toString());
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ msg: "Unable to place call" });
  }
});

module.exports = router;
