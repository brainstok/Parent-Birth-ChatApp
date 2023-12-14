const express = require("express");
const router = express.Router();
const jwtCheck = require("../../middleware/jwtCheck");
const apiKeyCheck = require("../../middleware/apiKeyCheck");
const {
  handleGetTreads,
  handleDeletePatient,
  handleUpdatePatient,
  handleGetPatient,
  handleCreatePatient,
  handleGetPatients,
  handleAddPatientOption,
  handleUpdatePatientForm,
  handleGetProvider,
  handleCreatePatientNote,
  handleUpdatePatientNote,
  handleUpdatePatientProvider,
  handleUpdateDate,
  handleUpdatePatientStatus,
  handleCreatePatientProviderEvent,
  handlePatientIntakeForm,
  handleDeletePatientNote,
  handleDeletePatientEvent,
  handleAddPatientTopics,
  handleDeletePatientTopic,
  handleEditTopic,
  handlePatientTransitionForm,
  handleGetPatientEngagement,
  handleGetRecentSignUps,
  handleGetPatientFormData,
  handleUpdatePatientEvent,
  handlePatientExport,
  handlePatientGuideDownload,
  handleGetTread,
  handleSaveDraft,
  handleGetDraft,
  handleDeleteDraft,
} = require("../../controllers/patients");

// @route POST api/patients/sign-up
// @desc signups a patient
// @access Public
router.post("/sign-up", async (req, res) => {
  try {
    const newPatient = await handleCreatePatient(req.body);

    res.status(201).json(newPatient);
  } catch (error) {
    if (error.message === "CONFLICT") {
      return res.status(401).json({ msg: "Duplicate" });
    }

    return res.status(400).json({ msg: "Unable to create Signup" });
  }
});

// @route POST api/patients
// @desc creates a patient
// @access Private
router.post("/", jwtCheck, async (req, res) => {
  try {
    const newPatient = await handleCreatePatient(req.body);

    res.status(201).json(newPatient);
  } catch (error) {
    let errorMessage = error.message;
    if (error.response) {
      errorMessage = error.response.data.message;
    }
    res.status(400).json(errorMessage);
  }
});

// @route GET api/patients/threads
// @desc Gets Patients that have messages
// @access Private
router.get("/threads", jwtCheck, async (req, res) => {
  try {
    const { limit, phoneNumber } = req.query;

    let result = null;

    if (limit) {
      result = await handleGetTreads(parseInt(limit));
    }

    if (phoneNumber) {
      result = await handleGetTread(phoneNumber);
    }

    res.status(200).json(result);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "Unable to get threads" });
  }
});

// @route GET api/patients
// @desc Gets patients
// @access Private
router.get("/", jwtCheck, async (req, res) => {
  const { phoneNumber } = req.query;
  try {
    // If query, get a single patient
    if (phoneNumber) {
      const contact = await handleGetPatient({ phoneNumber });
      return res.status(200).json(contact);
    }
    // Otherwise get all the patients
    const patients = await handleGetPatients();
    return res.status(200).json(patients);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "Unable to get patients" });
  }
});

// @route GET api/patients/export
// @desc Returns a data table as CSV
// @access Private
router.get("/export", async (req, res) => {
  try {
    let data = await handlePatientExport();
    res.status(200).json(data);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "Unable to download csv" });
  }
});

// @route GET api/patients/recent
// @desc Get recent signups
// @access Private
router.get("/recent", async (req, res) => {
  try {
    const signUps = await handleGetRecentSignUps();

    res.status(200).json(signUps);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: `Unable to get past 7-day signUps` });
  }
});

// @route GET api/patients/:patientId
// @desc Gets a Patient
// @access Private
router.get("/:patientId", jwtCheck, async (req, res) => {
  const { patientId } = req.params;

  try {
    const patient = await handleGetPatient({ id: patientId });

    res.status(200).json(patient);
  } catch (error) {
    console.log(error.message);
    res
      .status(500)
      .json({ msg: `Unable to get patient with id: ${patientId}` });
  }
});

// @route DELETE api/patients/:patientId
// @desc Deletes a patient
// @access Private
router.delete("/:patientId", jwtCheck, async (req, res) => {
  try {
    const { patientId } = req.params;
    await handleDeletePatient(patientId);

    res.status(200).json({ msg: "Patient has been deleted" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json(error.message);
  }
});

// @route PUT api/patients/[patientId]
// @desc Updates patient
// @access Private
router.put("/:patientId", jwtCheck, async (req, res) => {
  try {
    const { patientId } = req.params;
    const patientValues = req.body;

    const updatedPatient = await handleUpdatePatient({
      patientId,
      ...patientValues,
    });

    res.status(200).json(updatedPatient);
  } catch (error) {
    console.log(error.message);
    res.status(500).json(error.message);
  }
});

// @route POST api/patients/[patientId]/crm-options/[slug]
// @desc Adds crm option to patient
// @access Private
router.post("/:patientId/crm-options/:slug", jwtCheck, async (req, res) => {
  try {
    const { patientId, slug } = req.params;
    const option = req.body;
    const currentOptions = await handleAddPatientOption({
      patientId,
      slug,
      option,
    });

    res.status(201).json(currentOptions);
  } catch (error) {
    console.log(error.message);
    res.status(500).json(error.message);
  }
});

// @route PUT api/patients/[patientId]/provider
// @desc Updates provider for patient
// @access Private
router.put("/:patientId/provider", jwtCheck, async (req, res) => {
  try {
    const { patientId } = req.params;
    const { newProviderId } = req.body;

    const provider = await handleUpdatePatientProvider({
      patientId,
      providerId: newProviderId,
    });

    res.status(200).json(provider);
  } catch (error) {
    console.log(error.message);
    res.status(500).json(error.message);
  }
});

// @route PUT api/[patientId]/forms/[patientFormId]
// @desc Update patient form
// @access Private
router.put("/:patientId/forms/:patientFormId", jwtCheck, async (req, res) => {
  try {
    const { patientFormId, patientId } = req.params;
    const { isSent } = req.body;

    const result = await handleUpdatePatientForm({
      isSent,
      patientFormId,
    });

    res.status(200).json(result);
  } catch (error) {
    console.log(error.message);
    res.status(500).json(error.message);
  }
});

// @route POST api/patients/[patientId]/notes
// @desc creates provider note for a patient
// @access Private
router.post("/:patientId/notes", jwtCheck, async (req, res) => {
  try {
    const { patientId } = req.params;
    const { providerId, body, taggedProviderIds } = req.body;

    const notes = await handleCreatePatientNote({
      providerId,
      patientId,
      body,
      taggedProviderIds,
    });
    res.status(201).json(notes);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

// @route PUT api/patients/[patientId]/notes/[noteId]
// @desc Updates notes for a patient
// @access Private
router.put("/:patientId/notes/:noteId", jwtCheck, async (req, res) => {
  try {
    const { patientId, noteId } = req.params;
    const { body, taggedProviderIds } = req.body;

    const notes = await handleUpdatePatientNote({
      patientId,
      taggedProviderIds,
      noteId,
      body,
    });

    res.status(200).json(notes);
  } catch (error) {
    console.log(error.message);
    res.status(500).json(error.message);
  }
});

// @route DELETE api/patients/[patientId]/notes/[noteId]
// @desc Deletes notes for a patient
// @access Private
router.delete("/:patientId/notes/:noteId", jwtCheck, async (req, res) => {
  try {
    const { patientId, noteId } = req.params;

    const notes = await handleDeletePatientNote({
      patientId,
      noteId,
    });
    res.status(201).json(notes);
  } catch (error) {
    console.log(error.message);
    res.status(500).json(error.message);
  }
});

// @route GET api/patients/[patientId]/notes/provider/[providerId]
// @desc Gets a provider of an note
// @access Private
router.get(
  "/:patientId/notes/:noteId/provider/:providerId",
  jwtCheck,
  async (req, res) => {
    const { providerId } = req.params;

    try {
      const provider = await handleGetProvider({
        providerId,
      });
      res.status(200).json(provider);
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ msg: `Unable to get provider` });
    }
  }
);

// @route POST api/patients/[patientId]/events
// @desc creates provider event for a patient
// @access Private
router.post("/:patientId/events", jwtCheck, async (req, res) => {
  try {
    const { patientId } = req.params;
    const { providerId, id: eventTypeId } = req.body;

    const events = await handleCreatePatientProviderEvent({
      providerId,
      patientId,
      eventTypeId,
    });
    res.status(201).json(events);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

// @route DELETE api/patients/[patientId]/events/[eventId]
// @desc Deletes event for a patient
// @access Private
router.delete("/:patientId/events/:eventId", jwtCheck, async (req, res) => {
  try {
    const { patientId, eventId } = req.params;

    const events = await handleDeletePatientEvent({
      patientId,
      eventId,
    });
    res.status(200).json(events);
  } catch (error) {
    console.log(error.message);
    res.status(500).json(error.message);
  }
});

// @route PUT api/patients/[patientId]/events/[eventId]
// @desc Updates events for a patient
// @access Private
router.put("/:patientId/events/:eventId", jwtCheck, async (req, res) => {
  try {
    const { patientId, eventId } = req.params;
    const { createdAt, eventTypeId } = req.body;

    const events = await handleUpdatePatientEvent({
      patientId,
      eventId,
      createdAt,
      eventTypeId,
    });

    res.status(200).json(events);
  } catch (error) {
    console.log(error.message);
    res.status(500).json(error.message);
  }
});

// @route PUT api/patients/[patientId]/date
// @desc Updates updates for a patient
// @access Private
router.put("/:patientId/date", jwtCheck, async (req, res) => {
  try {
    const { patientId } = req.params;
    const { followUpDate, dueDate, dateOfBirth } = req.body;

    const updates = await handleUpdateDate({
      patientId,
      followUpDate,
      dueDate,
      dateOfBirth,
    });

    res.status(201).json(updates);
  } catch (error) {
    console.log(error.message);
    res.status(500).json(error.message);
  }
});

// @route PUT api/patients/[patientId]/status
// @desc Updates the status for a patient
// @access Private
router.put("/:patientId/status", jwtCheck, async (req, res) => {
  try {
    const { patientId } = req.params;
    const { isActive } = req.body;

    await handleUpdatePatientStatus({
      patientId,
      isActive,
    });

    res.status(200).json("Success");
  } catch (error) {
    console.log(error.message);
    res.status(500).json(error.message);
  }
});

// @route POST api/patients/partner
// @desc creates a patient
// @access Private
router.post("/partner", apiKeyCheck, async (req, res) => {
  try {
    const patient = req.body;
    // Partner applied via middleware
    const { partner } = res.locals;

    const patientInfo = { ...patient, partner, isActive: true };

    const newPatient = await handleCreatePatient(patientInfo);

    res.status(201).json(newPatient);
  } catch (error) {
    let errorMessage = error.message;
    if (error.response) {
      errorMessage = error.response.data.message;
    }
    res.status(400).json(errorMessage);
  }
});

// @route POST api/patients/[patient-id]/intake/[intake-form-id]
// @desc creates a patient
// @access Private
router.post("/:patientId/intake/:formId", async (req, res) => {
  try {
    const formValues = req.body;
    const { patientId, formId } = req.params;

    await handlePatientIntakeForm({ patientId, formId, ...formValues });

    res.status(201).json({ msg: "Successfully submitted intake form" });
  } catch (error) {
    let errorMessage = error.message;

    if (error.response) {
      errorMessage = error.response.data.message;
    }
    res.status(400).json(errorMessage);
  }
});

// @route POST api/patients/[patient-id]/transition/[transition-form-id]
// @desc creates a patient
// @access Private
router.post("/:patientId/transition/:formId", async (req, res) => {
  try {
    const formValues = req.body;
    const { patientId, formId } = req.params;

    await handlePatientTransitionForm({ patientId, formId, ...formValues });

    res.status(201).json({ msg: "Successfully submitted transition form" });
  } catch (error) {
    let errorMessage = error.message;

    if (error.response) {
      errorMessage = error.response.data.message;
    }
    res.status(400).json(errorMessage);
  }
});

// @route POST api/patients/[patientId]/topic
// @desc Adds topic for a patient
// @access Private
router.post("/:patientId/topic", jwtCheck, async (req, res) => {
  try {
    const { patientId } = req.params;
    const { topic, subtopics } = req.body;

    const currentOptions = await handleAddPatientTopics({
      topic,
      subtopics,
      patientId,
    });

    res.status(201).json(currentOptions);
  } catch (error) {
    console.log(error.message);
    res.status(500).json(error.message);
  }
});

// @route DELETE api/patients/[patientId]/topic/[patientTopicId]
// @desc Deletes patient topic from patient
// @access Private
router.delete(
  "/:patientId/topic/:patientTopicId",
  jwtCheck,
  async (req, res) => {
    try {
      const { patientId, patientTopicId } = req.params;

      const currentOptions = await handleDeletePatientTopic({
        patientId,
        patientTopicId,
      });

      res.status(201).json(currentOptions);
    } catch (error) {
      console.log(error.message);
      res.status(500).json(error.message);
    }
  }
);

// @route PUT api/patients/[patientId]/topic/[patientTopicId]
// @desc Update patient topic from patient
// @access Private
router.put("/:patientId/topic/:patientTopicId", jwtCheck, async (req, res) => {
  try {
    const { patientId, patientTopicId } = req.params;
    const { topic, subtopics } = req.body;

    const updatedTopic = await handleEditTopic({
      patientId,
      patientTopicId,
      topic,
      subtopics,
    });

    res.status(200).json(updatedTopic);
  } catch (error) {
    console.log(error.message);
    res.status(500).json(error.message);
  }
});

// @route GET api/patients/[patientId]/enagement
// @desc Gets the engagement of a patient
// @access Private
router.get("/:patientId/engagement", jwtCheck, async (req, res) => {
  const { patientId } = req.params;

  try {
    const engagement = await handleGetPatientEngagement(patientId);
    res.status(200).json(engagement);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: `Unable to get provider` });
  }
});

// @route GET api/patients/form/[formId]
// @desc Gets the data for public forms about the patient
// @access Public
router.get("/form/:formId", async (req, res) => {
  const { formId } = req.params;

  try {
    const patient = await handleGetPatientFormData(formId);
    res.status(200).json(patient);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: `Unable to get form data` });
  }
});

// @route POST api/patients/download-guide
// @desc Posts a request to SendGrid to send user the guide download email
// @access Public
router.post("/download-guide", async (req, res) => {
  const downloadGuideRequest = req.body;
  try {
    const downloadGuide = await handlePatientGuideDownload(
      downloadGuideRequest
    );
    res.status(200).json({});
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: `Unable to submit request` });
  }
});

// @route POST api/patients/:patientId/drafts
// @desc save draft patient
// @access Private
router.post("/:patientId/drafts", jwtCheck, async (req, res) => {
  try {
    const { patientId } = req.params;
    const { body } = req.body;
    await handleSaveDraft({ patientId, body });
    res.status(200).json("Draft saved successfully");
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ msg: "Unable to create draft" });
  }
});

// @route DELETE api/patients/:patientId/drafts
// @desc Deletes draft patient
// @access Private
router.delete("/:patientId/drafts", jwtCheck, async (req, res) => {
  try {
    const { patientId } = req.params;
    await handleDeleteDraft(patientId);
    res.status(200).json({ msg: "Draft has been deleted" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json(error.message);
  }
});

// @route GET api/patients/:patientId/drafts
// @desc get draft patient
// @access Private
router.get("/:patientId/drafts", jwtCheck, async (req, res) => {
  try {
    const { patientId } = req.params;
    const draft = await handleGetDraft(patientId);
    res.status(200).json(draft);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ msg: "Unable to get draft" });
  }
});

module.exports = router;
