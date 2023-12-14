const db = require("../db");

module.exports.getIsAwaySetting = async () => {
  try {
    return await db.oneOrNone(`
      SELECT 
      is_away AS "isAway"
      FROM setting`);
  } catch (error) {
    throw new Error(error);
  }
};

module.exports.updateIsAwaySetting = async (isAway) => {
  try {
    return await db.oneOrNone(
      `
      UPDATE setting 
      SET is_away= $1
      WHERE app_id = 1
      RETURNING 
      is_away AS "isAway"
    `,
      [isAway]
    );
  } catch (error) {
    throw new Error(error);
  }
};

module.exports.getAutomatedMessages = async () => {
  try {
    return await db.manyOrNone(`
      SELECT
      id,  
      label, 
      body, 
      string_id AS "stringId"
      FROM automated_message 
      ORDER BY id ASC 
    `);
  } catch (error) {
    throw new Error(error);
  }
};

module.exports.getAutomatedMessageViaStringId = async (stringId, locale) => {
  try {
    const automatedMessage = await db.oneOrNone(
      `SELECT
        body AS "body", 
        es_body AS "esBody"
        FROM automated_message 
        WHERE string_id = $1`,
      [stringId]
    );

    let body = automatedMessage.body;

    if (locale && locale === "es") {
      body = automatedMessage.esBody || automatedMessage.body;
    }

    return body;
  } catch (error) {
    throw new Error(error);
  }
};

module.exports.updateAutomatedMessage = async ({ id, body }) => {
  try {
    return await db.oneOrNone(
      `
      UPDATE automated_message 
      SET body = $1
      WHERE id = $2
      RETURNING 
      body AS "body"
    `,
      [body, id]
    );
  } catch (error) {
    throw new Error(error);
  }
};
