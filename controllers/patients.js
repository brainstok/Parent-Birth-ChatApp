const { app } = require("../server");
const {
  getPatient,
  updatePatient,
  deletePatient,
  getPatients,
  addPatientCrmOption,
  deletePatientCrmOption,
  createPatientNote,
  deletePatientNote,
  updatePatientNote,
  updatePatientForm,
  updatePatientProvider,
  updatePatientDate,
  updatePatientStatus,
  createPatient,
  getPatientViaPhoneNumber,
  getThreadPatient,
  getThreadPatients,
  createPatientEvent,
  deletePatientEvent,
  getPatientTopics,
  addPatientTopic,
  deletePatientTopic,
  updatePatientTopic,
  createPatientCrmOption,
  createPatientForm,
  getPatientFormData,
  updatePatientEvent,
  getPatientExport,
  getRecentSignUps,
  upsertPatientMessageDraft,
  getPatientMessageDraft,
  deletePatientMessageDraft,
} = require("../queries/patient");
let io = app.get("io");
const { getProvider } = require("../queries/user");
const calculateWeeksGetstation = require("../utils/calculateWeeksGetstation");
const calculateWeeksPostpartum = require("../utils/calculateWeeksPostpartum");
const { snakeCase } = require("change-case");
const { handleOutBoundMessage } = require("./messages");
const delay = require("delay");

const { getPatientMessageCount } = require("../queries/message");
const { sendNotification } = require("../services/slack");
const {
  sendConfirmationEmail,
  sendPatientToNewsletterList,
  sendGuideEmail,
} = require("../services/sendGrid");
const { getAutomatedMessageViaStringId } = require("../queries/setting");
const { getCityStateFromZip } = require("../services/google");

exports.handleCreatePatient = async ({ hasOptedIn, ...patientInfo }) => {
  // Check if patient exits
  let patient = await getPatientViaPhoneNumber(patientInfo.phoneNumber);

  const isExistingPatient = Boolean(patient?.displayName);

  if (isExistingPatient) {
    const isReturningPatient = patient?.status === "Inactive";

    const { city, state } = await getCityStateFromZip(patientInfo.zipCode);

    if (isReturningPatient) {
      try {
        const displayName = `${patientInfo.firstName}-${patient.id}`;

        const updatedValues = {
          ...patientInfo,
          displayName,
          currentStageId: patientInfo.stageId,
          statusId: 1,
          city,
          state,
        };

        // Remove keys not recognized by the patient table
        delete updatedValues.stageId;

        patient = await updatePatient({
          patientId: patient.id,
          ...updatedValues,
        });

        const welcomeBackResponse = await getAutomatedMessageViaStringId(
          "welcomeBack"
        );

        await handleOutBoundMessage({
          phoneNumber: patient.phoneNumber,
          body: welcomeBackResponse,
        });

        // Send Slack Notification in production env
        if (process.env.NODE_ENV === "production") {
          sendNotification({
            body: `${patient.displayName} just returned to parentbirth!`,
          });
        }

        return patient;
      } catch (error) {
        console.log(error);
        throw error;
      }
    } else {
      throw new Error("CONFLICT");
    }
  } else {
    try {
      // Get city and state from zipCode
      const { city, state } = await getCityStateFromZip(patientInfo.zipCode);

      // Create Patient
      patient = await createPatient({
        ...patientInfo,
        statusId: 1,
        city,
        state,
      });

      // Create Intake Form
      const { form: intakeForm, patientFormId } = await createPatientForm({
        patientId: patient.id,
        formTypeId: 1,
      });

      // Create Transition Form if the patient is pregnant
      if (patientInfo.stageId === 1) {
        await createPatientForm({ patientId: patient.id, formTypeId: 2 });
      }

      const welcomeResponse = await getAutomatedMessageViaStringId(
        "welcome",
        patient.locale
      );

      await handleOutBoundMessage({
        phoneNumber: patient.phoneNumber,
        body: welcomeResponse,
      });

      await delay(10000);

      const intakeResponse = await getAutomatedMessageViaStringId(
        "intake",
        patient.locale
      );

      const intakeFormMessage = `${intakeResponse} ${intakeForm.shortLink}`;

      await handleOutBoundMessage({
        phoneNumber: patient.phoneNumber,
        body: intakeFormMessage,
      });

      // set patient's intake form to sent
      await updatePatientForm({
        isSent: true,
        patientFormId,
      });

      // Send Slack Notification in production env
      if (process.env.NODE_ENV === "production") {
        sendNotification({
          body: `${patient.displayName} just signed up for parentbirth!`,
        });
      }

      sendConfirmationEmail({ email: patient.email });

      if (hasOptedIn) {
        sendPatientToNewsletterList({ ...patient });
      }

      return patient;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
};

exports.handleGetTreads = async (limit) => {
  try {
    const result = await getThreadPatients(limit);

    return result;
  } catch (error) {
    throw new Error(error);
  }
};

exports.handleGetTread = async (phoneNumber) => {
  try {
    const patient = await getThreadPatient(phoneNumber);

    return patient;
  } catch (error) {
    throw new Error(error);
  }
};

exports.handleDeletePatient = async (id) => {
  try {
    await deletePatient(id);
  } catch (error) {
    throw new Error(error);
  }
};

exports.handleGetPatients = async () => {
  try {
    const patients = await getPatients();

    const adjustedPatients = patients.map((patient) => ({
      ...patient,
      isActive: patient.status === "Active" ? true : false,
    }));
    return adjustedPatients;
  } catch (error) {
    throw new Error(error);
  }
};

exports.handleGetPatient = async ({ phoneNumber, id }) => {
  try {
    let patient = null;

    if (id) {
      patient = await getPatient(id);
    }
    if (phoneNumber) {
      patient = await getPatientViaPhoneNumber(phoneNumber);
    }

    if (patient) {
      const { dueDate, dateOfBirth } = patient;

      patient.weeksGestation = calculateWeeksGetstation(dueDate, dateOfBirth);
      patient.weeksPostpartum = calculateWeeksPostpartum(dateOfBirth);
    }

    return patient;
  } catch (error) {
    throw new Error(error);
  }
};

const handleUpdatePatient = async ({ patientId, ...values }) => {
  try {
    const updatedPatient = await updatePatient({ ...values, patientId });

    return updatedPatient;
  } catch (error) {
    throw new Error(error);
  }
};

exports.handleUpdatePatient = handleUpdatePatient;

const handleAddPatientOption = async ({ option, patientId, slug }) => {
  const joinTableName = `patient_${snakeCase(slug)}`;
  const optionTableName = snakeCase(slug);
  const optionIdName = `${optionTableName}_id`;
  const { id: optionId } = option;

  try {
    return await addPatientCrmOption({
      joinTableName,
      optionTableName,
      optionId,
      patientId,
      optionIdName,
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.handleAddPatientOption = handleAddPatientOption;

exports.handleDeletePatientOption = async ({ option, patientId, slug }) => {
  const joinTableName = `patient_${snakeCase(slug)}`;
  const optionTableName = snakeCase(slug);
  const optionIdName = `${optionTableName}_id`;
  const { id: optionId } = option;

  try {
    return await deletePatientCrmOption({
      joinTableName,
      optionTableName,
      optionId,
      patientId,
      optionIdName,
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.handleUpdatePatientProvider = async ({ patientId, providerId }) => {
  try {
    await updatePatientProvider({
      providerId,
      patientId,
    });
    const newProvider = await getProvider({ id: providerId });
    return newProvider;
  } catch (error) {
    console.log("Error @ handleUpdatePatientProvide: ", error);
    throw new Error(error);
  }
};

exports.handleUpdatePatientForm = async ({
  isSent,
  patientId,
  patientFormId,
}) => {
  try {
    return await updatePatientForm({ isSent, patientFormId });
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.handleGetProvider = async ({ providerId }) => {
  try {
    const provider = await getProvider(providerId);
    return provider;
  } catch (error) {
    console.log("Error @ handleGetProvider: ", error);
  }
};

exports.handleCreatePatientNote = async ({
  providerId,
  patientId,
  body,
  taggedProviderIds,
}) => {
  try {
    const notes = await createPatientNote({
      providerId,
      patientId,
      body,
      taggedProviderIds,
    });
    return notes;
  } catch (error) {
    console.log("Error @ handlecreatePatientNote: ", error);
    throw new Error(error);
  }
};

exports.handleUpdatePatientNote = async ({
  patientId,
  body,
  noteId,
  taggedProviderIds,
}) => {
  try {
    const notes = await updatePatientNote({
      noteId,
      patientId,
      body,
      taggedProviderIds,
    });
    return notes;
  } catch (error) {
    console.log("Error @ handleUpdatePatientNote: ", error);
    throw new Error(error);
  }
};

exports.handleDeletePatientNote = async ({ noteId, patientId }) => {
  try {
    const notes = await deletePatientNote({
      noteId,
      patientId,
    });
    return notes;
  } catch (error) {
    console.log("Error @ handleDeletePatientNote: ", error);
    throw new Error(error);
  }
};

exports.handleCreatePatientProviderEvent = async ({
  providerId,
  patientId,
  eventTypeId,
}) => {
  try {
    const events = await createPatientEvent({
      providerId,
      patientId,
      eventTypeId,
    });
    return events;
  } catch (error) {
    console.log("Error @ handleCreatePatientProviderEvent: ", error);
    throw new Error(error);
  }
};

exports.handleDeletePatientEvent = async ({ patientId, eventId }) => {
  try {
    const events = await deletePatientEvent({
      eventId,
      patientId,
    });
    return events;
  } catch (error) {
    console.log("Error @ handleDeletePatientEvent: ", error);
    throw new Error(error);
  }
};

exports.handleUpdatePatientEvent = async ({
  patientId,
  eventId,
  createdAt,
  eventTypeId,
}) => {
  try {
    const events = await updatePatientEvent({
      eventId,
      patientId,
      createdAt,
      eventTypeId,
    });
    return events;
  } catch (error) {
    console.log("Error @ handleUpdatePatientEvent: ", error);
    throw new Error(error);
  }
};

exports.handleUpdateDate = async ({
  patientId,
  followUpDate,
  dueDate,
  dateOfBirth,
}) => {
  try {
    let dateColumn = "";
    if (followUpDate || followUpDate === null) dateColumn = "follow_up_date";
    if (dueDate || dueDate === null) dateColumn = "baby_estimated_due_date";
    if (dateOfBirth || dateOfBirth === null) dateColumn = "baby_birth_date";

    await updatePatientDate({
      patientId,
      date: followUpDate || dueDate || dateOfBirth,
      dateColumn,
    });
  } catch (error) {
    console.log("Error @ handleUpdateDate: ", error);
    throw new Error(error);
  }
};

exports.handleUpdatePatientStatus = async ({ patientId, isActive }) => {
  try {
    await updatePatientStatus({
      patientId,
      isActive,
    });
  } catch (error) {
    console.log("Error @ handleUpdatePatientStatus: ", error);
    throw new Error(error);
  }
};

const handleMultipleChoiceInserts = async (optionsObject, patientId) => {
  try {
    for (const key in optionsObject) {
      const optionIdNames = snakeCase(key);
      const optionIdName = optionIdNames.substring(0, optionIdNames.length - 1);

      const joinTableName = `patient_${optionIdName
        .split("_")
        .slice(0, -1)
        .join("_")}`;

      const ids = optionsObject[key];

      if (ids) {
        for (const optionId of ids) {
          await createPatientCrmOption({
            patientId,
            joinTableName,
            optionIdName,
            optionId,
          });
        }
      }
    }
  } catch (error) {
    console.log("Error @  handleMultipleChoiceInserts: ", error);
    throw new Error(error);
  }
};

exports.handlePatientIntakeForm = async ({ patientId, ...formValues }) => {
  try {
    const patient = await getPatient(patientId);

    if (patient) {
      const { id: patientId } = patient;
      const {
        sdohIds,
        feedingIds,
        birthInterventionIds,
        pmadIds,
        formId,
        stageId,
        ...patientDetailIds
      } = formValues;

      await handleUpdatePatient({
        patientId,
        ...patientDetailIds,
      });

      const obj = {
        sdohIds,
        feedingIds,
        birthInterventionIds,
        pmadIds,
      };

      await handleMultipleChoiceInserts(obj, patientId);

      // Set intake form to received
      await updatePatientForm({
        isCompleted: true,
        patientFormId: formId,
      });
    } else {
      throw new Error("Patient not found");
    }
  } catch (error) {
    throw new Error(error);
  }
};

exports.handlePatientTransitionForm = async ({ patientId, ...formValues }) => {
  try {
    const patient = await getPatient(patientId);

    if (patient) {
      const {
        sdohIds,
        feedingIds,
        birthInterventionIds,
        pmadIds,
        formId,
        stageId,
        ...patientDetailIds
      } = formValues;

      await handleUpdatePatient({
        patientId,
        ...patientDetailIds,
      });

      const obj = {
        sdohIds,
        feedingIds,
        birthInterventionIds,
        pmadIds,
      };

      await handleMultipleChoiceInserts(obj, patientId);

      // Set follow up form to received
      await updatePatientForm({
        isCompleted: true,
        patientFormId: formId,
      });
    } else {
      throw new Error("Patient not found");
    }
  } catch (error) {
    throw new Error(error);
  }
};

exports.handleAddPatientTopics = async ({ topic, subtopics, patientId }) => {
  try {
    await addPatientTopic({ topic, subtopics, patientId });

    const topics = getPatientTopics(patientId);

    return topics;
  } catch (error) {
    throw new Error(error);
  }
};

exports.handleDeletePatientTopic = async ({ patientId, patientTopicId }) => {
  try {
    await deletePatientTopic(patientTopicId);

    const topics = getPatientTopics(patientId);
    return topics;
  } catch (error) {
    throw new Error(error);
  }
};

exports.handleEditTopic = async ({
  patientId,
  patientTopicId,
  topic,
  subtopics,
}) => {
  try {
    return await updatePatientTopic({
      patientId,
      patientTopicId,
      topic,
      subtopics,
    });
  } catch (error) {
    throw new Error(error);
  }
};

exports.handleGetPatientEngagement = async (patientId) => {
  try {
    const { messageCount } = await getPatientMessageCount(patientId);

    let engagement = "❄️ Cold";

    switch (true) {
      case messageCount >= 2:
        engagement = "🔥 Hot";
        break;
      case messageCount === 1:
        engagement = "🌤 Warm";
        break;
    }

    return engagement;
  } catch (error) {
    throw new Error(error);
  }
};

exports.handleGetRecentSignUps = async () => {
  try {
    const signUps = await getRecentSignUps(7);
    return signUps;
  } catch (error) {
    throw new Error(error);
  }
};

exports.handleGetPatientFormData = async (formId) => {
  try {
    return await getPatientFormData(formId);
  } catch (error) {
    throw new Error(error);
  }
};

const yesNo = (value) => {
  if (typeof value == "boolean") {
    return value ? "Yes" : "No";
  } else {
    return null;
  }
};

const getLabels = (array) => {
  return array.map((obj) => obj.label).join(", ");
};

exports.handlePatientExport = async () => {
  try {
    const patients = await getPatientExport();

    const data = [];

    const headers = [
      "createdAt",
      "# inbound messages",
      "due date",
      "date of birth",
      "city",
      "state",
      "zip code",
      "status",
      "signup stage",
      "current stage",
      "age range",
      "ethnic identity",
      "gender identity",
      "has in person doula interest",
      "pregnancy amount",
      "live birth amount",
      "miscarriage amount",
      "has insurance",
      "insurance type",
      "has birth plan",
      "has medical care provider",
      "has nicu",
      "birthWeeks gestation",
      "postpartum care visit",
      "has pmad",
      "birth interventions",
      "sdoh",
      "feeding",
      "pmad",
      "topics",
    ];

    patients.forEach((patient) => {
      const patientData = [
        patient.createdAt,
        patient.inboundMessagesCount,
        patient.dueDate,
        patient.dateOfBirth,
        patient.city,
        patient.state,
        patient.zipCode,
        patient.status.label,
        patient.signupStage.label,
        patient.currentStage.label,
        patient.ageRange,
        patient.ethnicIdentity,
        patient.genderIdentity,
        yesNo(patient.hasInPersonDoulaInterest),
        patient.pregnacyAmount,
        patient.liveBirthAmount,
        patient.miscarriageAmount,
        yesNo(patient.hasInsurance),
        patient.insuranceType,
        yesNo(patient.hasBirthPlan),
        yesNo(patient.hasMedicalCareProvider),
        yesNo(patient.hasNicu),
        patient.birthWeeksGestation,
        patient.postpartumCareVisit,
        yesNo(patient.hasPmad),
        getLabels(patient.birthInterventions),
        getLabels(patient.sdoh),
        getLabels(patient.feeding),
        getLabels(patient.pmad),
      ];

      data.push(patientData);
    });

    data.unshift(headers);

    return data;
  } catch (error) {
    throw new Error(error);
  }
};

exports.handlePatientGuideDownload = async (downloadGuide) => {
  const { email, guideTitle } = downloadGuide;

  await sendGuideEmail(downloadGuide);

  await sendNotification({
    body: `${email} just downloaded the "${guideTitle}" guide!`,
  });
};

exports.handleSaveDraft = async (values) => {
  try {
    await upsertPatientMessageDraft(values);
    io.emit("update_threads");
    return;
  } catch (error) {
    console.log(error.message);
    throw error;
  }
};

exports.handleGetDraft = async (patientId) => {
  try {
    return await getPatientMessageDraft(patientId);
  } catch (error) {
    console.log(error.message);
    throw error;
  }
};

exports.handleDeleteDraft = async (patientId) => {
  try {
    await deletePatientMessageDraft(patientId);
    io.emit("update_threads");
    return;
  } catch (error) {
    console.log(error.message);
    throw error;
  }
};
