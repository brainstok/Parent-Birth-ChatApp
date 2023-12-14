const express = require("express");
const router = express.Router();
const {
  handleGetResources,
  handleGetResource,
  handleGetResourceTopics,
  handleGetResourceSubtopics,
} = require("../../controllers/resources");

// @route GET /api/resources/topics
// @desc Gets resource topics
// @access Public
router.get("/topics", async (req, res) => {
  try {
    const topics = await handleGetResourceTopics();
    res.status(200).json(topics);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "Unable to get resource topics" });
  }
});

// @route GET /api/resources/topics/[topicId]/subtopics
// @desc Gets resource subtopics of a topic
// @access Public
router.get("/topics/:topicId/subtopics", async (req, res) => {
  try {
    const { topicId } = req.params;
    const subtopics = await handleGetResourceSubtopics(topicId);
    res.status(200).json(subtopics);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "Unable to get resource topics" });
  }
});

// @route GET /api/resources
// @desc Gets resources
// @access Public
router.get("/", async (req, res) => {
  try {
    const resources = await handleGetResources(req.query);
    res.status(200).json(resources);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "Unable to get resources" });
  }
});

// @route GET /api/resource
// @desc Gets resources
// @access Public
router.get("/:resourceId", async (req, res) => {
  try {
    const { resourceId } = req.params;
    const resources = await handleGetResource(resourceId);
    res.status(200).json(resources);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "Unable to get resources" });
  }
});

module.exports = router;
