const axios = require("axios");

exports.sendNotification = async ({ body }) => {
  try {
    const slackPayload = {
      text: "New Messsages",
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: body,
          },
        },
      ],
    };

    // Sends notifications to the #parentbirth channel
    await axios.post(
      "https://hooks.slack.com/services/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",
      slackPayload
    );
  } catch (error) {
    console.log("Error @ sendNotification: ", error.message);
    return error;
  }
};
