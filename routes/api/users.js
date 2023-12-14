const express = require("express");
const router = express.Router();
const jwtCheck = require("../../middleware/jwtCheck");
const {
  handleDeleteUser,
  handleGetProviders,
  handleCreateUser,
  handleUpdateUser,
  handleGetProvider,
  handleUpdateProviderNoteTag,
} = require("../../controllers/users");
const { signUpUser } = require("../../services/auth0");

// @route POST api/users
// @desc Creates User
// @access Private
router.post("/", jwtCheck, async (req, res) => {
  try {
    const newUser = await handleCreateUser(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    let errorMessage = error.message;
    if (error.response) {
      errorMessage = error.response.data.message;
    }
    res.status(400).json(errorMessage);
  }
});

// @route PUT api/users/providers
// @desc Updates provider
// @access Private
router.put("/providers/:id", jwtCheck, async (req, res) => {
  try {
    const user = req.body;
    user.id = req.params.id;

    const updatedUser = await handleUpdateUser(user);

    res.status(201).json(updatedUser);
  } catch (error) {
    console.log(error.message);
    res.status(500).json(error.message);
  }
});

// @route DELETE api/users
// @desc Deletes user
// @access Private
router.delete("/:userId", jwtCheck, async (req, res) => {
  try {
    const { userId } = req.params;
    const updatedUser = await handleDeleteUser(userId);
    res.status(204).json(updatedUser);
  } catch (error) {
    console.log(error.message);
    res.status(500).json(error.message);
  }
});

// @route GET api/users/providers
// @desc Gets Users that are providers
// @access Private
router.get("/providers", jwtCheck, async (req, res) => {
  try {
    const providers = await handleGetProviders();
    res.status(200).json(providers);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "Unable to get providers" });
  }
});

// @route POST api/users/providers
// @desc creates user that is a patient
// @access Private
router.post("/providers", jwtCheck, async (req, res) => {
  try {
    const user = req.body;
    user.role = "provider";

    await signUpUser(user);

    const newProvider = await handleCreateUser(user);

    res.status(201).json(newProvider);
  } catch (error) {
    let errorMessage = error.message;
    if (error.response) {
      errorMessage = error.response.data.message;
    }
    res.status(400).json(errorMessage);
  }
});

// @route GET api/users/providers
// @desc Gets provider via auth0id
// @access Private
router.get("/provider", jwtCheck, async (req, res) => {
  try {
    const { auth0Id } = req.query;
    const provider = await handleGetProvider({ auth0Id });
    res.status(200).json(provider);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "Unable to get Provider" });
  }
});

// @route PUT api/users/providers/[providerId]/tags/[tagId]
// @desc Gets tags of a provider
// @access Private
router.put("/provider/:providerId/tags/:tagId", jwtCheck, async (req, res) => {
  try {
    const { providerId, tagId } = req.params;
    const { isCompleted } = req.body;
    const updatedTags = await handleUpdateProviderNoteTag({
      providerId,
      tagId,
      isCompleted,
    });

    res.status(200).json(updatedTags);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "Unable to get Provider" });
  }
});

module.exports = router;
