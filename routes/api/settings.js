const express = require("express");
const router = express.Router();
const jwtCheck = require("../../middleware/jwtCheck");
const authCheck = require("../../middleware/authCheck");
const {
  handleGetIsAwaySetting,
  handleIsAwaySetting,
  handleGetAutomatedMessages,
  handleUpdateAutomatedMessages,
} = require("../../controllers/settings");

// @route GET api/settings/away
// @desc Gets Settings
// @access Public
router.get("/away", authCheck, async (req, res) => {
  try {
    const isAway = await handleGetIsAwaySetting();

    return res.status(200).json(isAway);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "Unable to get settings" });
  }
});

// @route GET api/settings
// @desc Gets Settings
// @access Public
router.put("/away", jwtCheck, async (req, res) => {
  try {
    const isAway = req.body;
    const updatedSettings = await handleIsAwaySetting(isAway);
    res.status(200).json(updatedSettings);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "Unable to update  settings" });
  }
});

// @route GET api/settings/automated-messages
// @desc Updates an automated message
// @access Private
router.get("/automated-messages", jwtCheck, async (req, res) => {
  try {
    const automatedMessage = await handleGetAutomatedMessages();
    return res.status(200).json(automatedMessage);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "Unable to get automated-messages" });
  }
});

// @route PUT api/settings/automated-messages/[message-id]
// @desc Updates an automated message
// @access Private
router.put("/automated-messages/:messageId", jwtCheck, async (req, res) => {
  try {
    const messageInfo = req.body;
    messageInfo.id = req.params.messageId;

    const updatedMessage = await handleUpdateAutomatedMessages(messageInfo);

    res.status(200).json(updatedMessage);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "Unable to update settings" });
  }
});

module.exports = router;
