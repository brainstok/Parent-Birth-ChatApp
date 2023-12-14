const db = require("../db");
const pgp = require("pg-promise")();

module.exports.getProviderViaAuth0Id = async (auth0Id) => {
  try {
    return await db.one(
      `SELECT * FROM v_provider WHERE v_provider."auth0Id" = $1`,
      auth0Id
    );
  } catch (error) {
    console.log("Error @ getProviderViaAuth0Id", error.message);
    throw new Error(error);
  }
};

module.exports.updateProviderNoteTag = async ({
  isCompleted,
  providerId,
  tagId,
}) => {
  try {
    return await db.task(async (task) => {
      await task.none(
        `UPDATE 
         provider_note_tag 
         SET is_completed = $2
         WHERE id = $1`,
        [tagId, isCompleted]
      );
      return await task.manyOrNone(
        `SELECT 
          provider_note_tag.id AS "id",
          is_completed AS "isCompleted",
          json_build_object(
            'id', patient_note.id,
            'body', patient_note.body,
            'createdAt', patient_note.created_at,
            'patientId', patient_note.patient_id
            ) AS "patientNote"
          FROM provider_note_tag 
          JOIN patient_note
          ON patient_note.id = provider_note_tag.patient_note_id
          WHERE provider_note_tag.provider_id = $1`,
        [providerId]
      );
    });
  } catch (error) {
    console.log("Error @ getProviderViaAuth0Id", error.message);
    throw new Error(error);
  }
};

module.exports.getDoulas = async () => {
  try {
    return await db.manyOrNone(
      `SELECT * FROM v_provider WHERE v_provider."roleId" = 2`
    );
  } catch (error) {
    console.log("Error @ getDoulas", error.message);
    throw new Error(error);
  }
};

module.exports.getProviders = async (whereQuery = "") => {
  try {
    return await db.manyOrNone(`SELECT * FROM v_provider`);
  } catch (error) {
    console.log("Error @ getAgents", error.message);
    return null;
  }
};
