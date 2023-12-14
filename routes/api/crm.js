const express = require("express");
const router = express.Router();
const jwtCheck = require("../../middleware/jwtCheck");
const {
	handleGetOptions,
	handleAddNewOption,
	handleGetFormOptions,
} = require("../../controllers/crm");

// @route GET api/crm/options/[option-name]
// @desc Gets Users that are providers
// @access Public
router.get("/options/:slug", jwtCheck, async (req, res) => {
	const { slug } = req.params;

	try {
		let options = await handleGetOptions(slug, req.query);
		res.status(200).json(options);
	} catch (error) {
		console.log(error.message);
		res.status(500).json({ msg: "Unable to get crm options" });
	}
});

// @route POST api/crm/options/[slug]
// @desc Creates a new option
// @access Public
router.post("/options/:slug", jwtCheck, async (req, res) => {
	const { slug } = req.params;
	const { option } = req.body;
	try {
		const result = await handleAddNewOption({ option, slug });
		res.status(200).json(result);
	} catch (error) {
		console.log(error.message);
		res.status(500).json({ msg: "Unable to get options for " + slug });
	}
});

// @route GET api/crm/form-options/[form-name]
// @desc Gets options for a form based on the formName parameter
// @access Public
router.get("/form-options/:formName", async (req, res) => {
	const { formName } = req.params;
	const { locale } = req.query;

	try {
		const result = await handleGetFormOptions(formName, locale);

		res.status(200).json(result);
	} catch (error) {
		console.log(error.message);
		res.status(500).json({ msg: "Unable to get options for " + formName });
	}
});
module.exports = router;
