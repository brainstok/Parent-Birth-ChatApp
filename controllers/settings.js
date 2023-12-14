const {
  getIsAwaySetting,
  updateIsAwaySetting,
  getAutomatedMessages,
  updateAutomatedMessage,
} = require("../queries/setting");
const { app } = require("../server");
let io = app.get("io");

module.exports.handleGetIsAwaySetting = async () => {
  try {
    const result = await getIsAwaySetting();
    return result.isAway;
  } catch (error) {
    throw new Error(error);
  }
};

module.exports.handleIsAwaySetting = async ({ isAway }) => {
  try {
    const updatedSettings = await updateIsAwaySetting(isAway);

    io.emit("updateSettings", updatedSettings);

    return updatedSettings;
  } catch (error) {
    throw new Error(error);
  }
};

module.exports.handleGetAutomatedMessages = async () => {
  try {
    return await getAutomatedMessages();
  } catch (error) {
    throw new Error(error);
  }
};

module.exports.handleUpdateAutomatedMessages = async ({ id, body }) => {
  try {
    return await updateAutomatedMessage({ id, body });
  } catch (error) {
    throw new Error(error);
  }
};
