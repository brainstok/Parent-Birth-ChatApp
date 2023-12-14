const express = require("express");
const router = express.Router();
const {
  handleGetMessages,
  handleGetThread,
  handleInboundTextMessage,
  handleUpdatePatientMessagesToIsRead,
  handleOutBoundMessage,
  handleMassText,
  handleAiResponse,
  handleGetMessageIndex,
} = require("../../controllers/messages");
const jwtCheck = require("../../middleware/jwtCheck");

// @route POST api/messages
// @desc Creates a Message
// @access Public
router.post("/", async (req, res) => {
  try {
    const {
      body: { Body: body, From: fromPhoneNumber, To: toPhoneNumber },
    } = req;

    const reponseBody = await handleInboundTextMessage({
      body,
      fromPhoneNumber,
      toPhoneNumber,
    });
    res.writeHead(200, { "Content-Type": "text/xml" });
    return res.end(reponseBody.toString());
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ msg: "Unable to create message" });
  }
});

router.post("/outbound", async (req, res) => {
  try {
    const { body, phoneNumber, auth0Id } = req.body;

    await handleOutBoundMessage({
      body,
      auth0Id,
      phoneNumber,
    });

    res.status(201).json({ msg: "Successfully sent message" });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ msg: "Unable to create message" });
  }
});

// @route GET api/message/[messageId]/index
// @desc Gets Selected Search Message Index on the Thread
// @access Public
router.get("/:messageId/index", jwtCheck, async (req, res) => {
	const { messageId } = req.params;
  const { phoneNumber } = req.query;

	try {
		const messageIndex = await handleGetMessageIndex({
      phoneNumber,
      selectedMessageId: messageId,
    });
		res.status(200).json(messageIndex);
	} catch (error) {
		console.log(error.message);
		res.status(500).json({ msg: "Unable to get message index." });
	}
});

// @route GET api/messages/thread
// @desc Gets Messages
// @access Public
router.get("/thread", jwtCheck, async (req, res) => {
  try {
    const { phoneNumber, limit } = req.query;

    const messages = await handleGetThread({
      phoneNumber,
      limit,
    });

    res.status(200).json(messages);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ msg: "Unable to get messages" });
  }
});

// @route GET api/messages
// @desc Gets Messages
// @access Public
router.get("/", jwtCheck, async (req, res) => {
  try {
    const messages = await handleGetMessages(req.query);

    res.status(200).json(messages);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ msg: "Unable to get messages" });
  }
});

router.put("/is-read", async (req, res) => {
  try {
    const { patientId } = req.body;
    await handleUpdatePatientMessagesToIsRead(patientId);

    res.status(200).json({ mgs: "Successfully updated read messages" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "Unable to set messages to read" });
  }
});

// @route POST api/messages/mass
// @desc Tests a mass message
// @access Private
router.post("/mass", jwtCheck, async (req, res) => {
  try {
    const { body } = req.body;

    await handleMassText(body);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ msg: "Unable to create message" });
  }
});

// @route POST api/messages/mass/test
// @desc Tests a mass message
// @access Private
router.post("/mass/test", jwtCheck, async (req, res) => {
  try {
    const { body, phoneNumber, auth0Id } = req.body;

    await handleOutBoundMessage({
      body,
      auth0Id,
      phoneNumber,
    });

    res
      .status(201)
      .json({ msg: `Successfully sent test message to ${phoneNumber}` });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ msg: "Unable to create message" });
  }
});

// @route POST api/messages/ai
// @desc Gets an virtual doula ai response
// @access Private
router.get("/ai", async (req, res) => {
  try {
    const { patientId } = req.query;

    const aiResponse = await handleAiResponse(patientId);

    res.status(200).json(aiResponse);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ msg: "Unable to create message" });
  }
});

module.exports = router;
