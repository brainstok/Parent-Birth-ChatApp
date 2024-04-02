const { app } = require("../server");
let io = app.get("io");

const { sendTextMessage } = require("../services/twilio");
const { getIsAwaySetting } = require("../queries/setting");
const delay = require("delay");
const Twilio = require("twilio");
const {
  createPatient,
  getPatientViaPhoneNumber,
  getPatientWithLastMessage,
  updatePatientLastMessageId,
  updatePatient,
  getPatients,
  deletePatientMessageDraft,
  upsertPatientMessageDraft,
} = require("../queries/patient");
const { getProviderViaAuth0Id } = require("../queries/user");
const {
  createMessage,
  getThread,
  getLastPatientMessage,
  getMessagesViaQuery,
  updatePatientMessagesToIsRead,
  getMessageIndex,
} = require("../queries/message");
const { getAutomatedMessageViaStringId } = require("../queries/setting");
const { sendNotification } = require("../services/slack");
const { stopKeywords, startKeywords } = require("../utils/constants");
const { eachOfSeries } = require("async");
const { runCompletion } = require("../services/openai");

const MessagingResponse = Twilio.twiml.MessagingResponse;

const handleNewMessage = async ({
  createdByPatient,
  createdByProvider,
  toPhoneNumber,
  fromPhoneNumber,
  patientPhoneNumber,
  body,
  patientId,
}) => {
  try {
    const newMessage = await createMessage({
      createdByPatientId: createdByPatient?.id || null,
      createdByProviderId: createdByProvider?.id || null,
      body,
      toPhoneNumber,
      fromPhoneNumber,
      isRead: createdByProvider?.id ? true : false,
    });

    //Emit Message to client
    io.to(patientPhoneNumber).emit("new_message", {
      createdByPatient: createdByPatient || null,
      createdByProvider: createdByProvider || null,
      toPhoneNumber,
      fromPhoneNumber,
      body,
    });

    // Update the last read message of the patient
    const patient = await updatePatientLastMessageId({
      patientId: patientId,
      lastMessageId: newMessage.id,
    });

    // Only update threads if not bot:
    if (createdByProvider?.role !== "Bot") {
      io.emit("update_threads");
    }

    return patient;
  } catch (error) {
    console.log(error.message);
  }
};
exports.handleNewMessage = handleNewMessage;

const handleUpdateThreads = async ({ patientId }) => {
  try {
    const patient = await getPatientWithLastMessage(patientId);
    // Emit  Alert to Client
    io.emit("update_threads", { thread: patient });
  } catch (error) {
    console.log(error);
  }
};
exports.handleUpdateThreads = handleUpdateThreads;

exports.handleGetMessageIndex = async ({ phoneNumber, selectedMessageId }) => {
  try {
    const messageIndex = await getMessageIndex({
      phoneNumber,
      selectedMessageId,
    });
    return messageIndex;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

exports.handleGetThread = async ({ phoneNumber, limit }) => {
  try {
    const threadData = await getThread({
      phoneNumber,
      limit,
    });
    return threadData;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

exports.handleGetMessages = async (query) => {
  try {
    const { filterByUserType } = query;

    if (filterByUserType === "patient") {
      query.createdByPatient = true;
    }

    if (filterByUserType === "provider") {
      query.createdByProvider = true;
    }
    const messageData = await getMessagesViaQuery(query);

    return messageData;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const handleOutBoundMessage = async (newMessage) => {
  const { body, phoneNumber, auth0Id } = newMessage;

  // If human provider use auth0Id otherwise use bot auth0Id
  const provider = await getProviderViaAuth0Id(auth0Id || "000");

  const patient = await getPatientViaPhoneNumber(phoneNumber);

  if (!patient) {
    throw new Error("Patient not found");
  }

  await deletePatientMessageDraft(patient.id);

  await handleNewMessage({
    createdByProvider: provider,
    toPhoneNumber: phoneNumber,
    fromPhoneNumber: process.env.APP_PHONE_NUMBER,
    patientPhoneNumber: phoneNumber,
    body,
    patientId: patient.id,
  });

  sendTextMessage({
    toPhoneNumber: phoneNumber,
    body,
  });
};

exports.handleOutBoundMessage = handleOutBoundMessage;

exports.handleInboundTextMessage = async ({
  body,
  fromPhoneNumber,
  toPhoneNumber,
}) => {
  // The order of operations blow is as follows
  // Check if the patient exists
  // If the patient does not exist, create the patient with n/a values
  // Post the patient message
  // Handle any automated responses after the patient's message has been posted

  const twiml = new MessagingResponse();

  let patient = await getPatientViaPhoneNumber(fromPhoneNumber);

  // Handle Active/inactive of exiting patient based on start/stop keywords
  const isStoppping = stopKeywords.includes(body.trim().toUpperCase());
  const isStarting = startKeywords.includes(body.trim().toUpperCase());

  if (patient) {
    if (isStoppping) {
      await updatePatient({ statusId: 2, patientId: patient.id });
    } else if (isStarting) {
      await updatePatient({ statusId: 1, patientId: patient.id });
    }
  }

  const isNewPatient = !patient;

  // If this a new potential patient
  if (isNewPatient) {
    // Create new patient, the away condition below depends on it
    patient = await createPatient({
      phoneNumber: fromPhoneNumber,
      statusId: 2,
    });
  }

  // All incoming messages are posted
  const newMessage = await handleNewMessage({
    fromPhoneNumber,
    toPhoneNumber,
    createdByPatient: patient,
    patientPhoneNumber: patient.phoneNumber,
    body,
    patientId: patient.id,
  });

  // Send Slack Notification in production env
  if (process.env.NODE_ENV === "production") {
    sendNotification({
      body: `New message from ${patient.displayName}.`,
    });
  }

  const unknownIncoming = patient.status === "Inactive" && !isStarting;

  // After the message of the new patient has been posted handle the appropiate automation
  if (isNewPatient || unknownIncoming) {
    const unknownIncomingResponse = await getAutomatedMessageViaStringId(
      "unknownIncoming"
    );

    // Send Unknown Response
    await handleOutBoundMessage({
      phoneNumber: fromPhoneNumber,
      body: unknownIncomingResponse,
    });
  }

  const { isAway } = await getIsAwaySetting();
  //  If the app is set to away for current patients
  if (isAway && !unknownIncoming) {
    const awayResponse = await getAutomatedMessageViaStringId("away");
    // check if the away message has been sent to this user already
    if (patient.lastMessage?.body !== awayResponse) {
      console.log("Handle away");
      await delay(1000);

      await handleOutBoundMessage({
        phoneNumber: fromPhoneNumber,
        body: awayResponse,
      });
    }
  }

  io.emit("update_threads");

  return twiml;
};

exports.handleUpdatePatientMessagesToIsRead = async (patientId) => {
  try {
    const updatedPatient = await updatePatientMessagesToIsRead(patientId);

    io.emit("update_threads");

    return updatedPatient;
  } catch (error) {
    console.log(error.message);
    throw error;
  }
};

exports.handleMassText = async (body) => {
  try {
    const patients = await getPatients();

    await eachOfSeries(patients, async (patient) => {
      console.log("Sending mass text to => ", patient.phoneNumber);
      const message = {
        body,
        phoneNumber: patient.phoneNumber,
      };
      await handleOutBoundMessage(message);
      delay(1000);
    });
  } catch (error) {
    console.log(error.message);
    throw error;
  }
};

exports.handleAiResponse = async (patientId) => {
  try {
    // get last patient message
    const lastPatientMassage = await getLastPatientMessage(patientId);
    if (lastPatientMassage?.body) {
      return await runCompletion(lastPatientMassage.body);
      console.log("finished");
    } else {
      throw new Error("Patient does not have a last message");
    }
  } catch (error) {
    console.log(error.message);
    throw error;
  }
};
