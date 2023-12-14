const dialogflow = require("@google-cloud/dialogflow");
const uuid = require("uuid");
const credentials = require("../credentials.json");

const sessionId = uuid.v4();

exports.runQuery = async (queryText, sessionId) => {
  // A unique identifier for the given session

  const projectId = "chat-bot-302523";

  // Create a new session
  const sessionClient = new dialogflow.SessionsClient({ credentials });
  const sessionPath = sessionClient.projectAgentSessionPath(
    projectId,
    sessionId
  );

  // The text query request.
  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        // The query to send to the dialogflow agent
        text: queryText,
        // The language used by the client (en-US)
        languageCode: "en-US",
      },
    },
  };

  // Send request and log result
  const responses = await sessionClient.detectIntent(request);

  const result = responses[0].queryResult;
  // console.log(`  Result: ${result.queryText}`);
  // console.log(`  Query: ${result.queryText}`);
  // console.log(`  Response: ${result.fulfillmentText}`);

  if (result.intent) {
    // console.log(`  Intent: ${result.intent.displayName}`);
    return result.fulfillmentText;
  } else {
    console.log(`  No intent matched.`);
  }
};
