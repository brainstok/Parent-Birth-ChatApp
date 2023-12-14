const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

exports.runCompletion = async (prompt) => {
  try {
    const messages = [
      {
        role: "system",
        content:
          "You are Robyn's virtual doula and provide answers to questions around pregnancy, postpartum, emotional support, newborn care, and infant feeding.",
      },
      {
        role: "user",
        content: prompt,
      },
    ];

    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      max_tokens: 1000,
      messages,
    });

    return completion.data.choices[0].message.content;
  } catch (error) {
    if (error.response) {
      console.log(error.response.status);
      console.log(error.response.data);
      throw Error(error);
    } else {
      console.log(error.message);
      throw Error(error);
    }
  }
};
