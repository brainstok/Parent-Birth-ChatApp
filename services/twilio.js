const Twilio = require("twilio");

const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
const parentBirtPhoneNumber = process.env.APP_PHONE_NUMBER;

const client = new Twilio(twilioAccountSid, twilioAuthToken);

module.exports.sendTextMessage = async ({
  toPhoneNumber,
  body,
  fromPhoneNumber,
}) => {
  try {
    const result = await client.messages.create({
      body,
      to: toPhoneNumber,
      from: fromPhoneNumber || parentBirtPhoneNumber,
    });
  } catch (error) {
    console.log(error);
  }
};
