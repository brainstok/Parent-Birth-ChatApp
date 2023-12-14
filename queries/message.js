const { tryEach } = require("async");
const db = require("../db");

module.exports.createMessage = async (values) => {
  try {
    return db.oneOrNone(
      `INSERT INTO message 
        (body,
        created_by_patient_id,  
        created_by_provider_id,
        from_phone_number,
        to_phone_number,
        is_read)
        VALUES
        ($1,
        $2,
        $3,
        $4,
        $5,
        $6)
        RETURNING 
        id AS "id",
        created_by_patient_id AS "createdByPatientId",  
        created_by_provider_id AS "createdByProviderId",
        from_phone_number AS "fromPhoneNumber",
        to_phone_number AS "toPhoneNumber"`,
      [
        values.body,
        values.createdByPatientId,
        values.createdByProviderId,
        values.fromPhoneNumber,
        values.toPhoneNumber,
        values.isRead,
      ]
    );
  } catch (error) {
    console.log(`Error @ createMessage: ${error}`);
    throw new Error(error);
  }
};

exports.getPatientMessageCount = async (patientId) => {
  try {
    return db.oneOrNone(
      `SELECT COUNT(*) AS "messageCount"
        FROM message 
        WHERE created_by_patient_id = $1
      `,
      [patientId]
    );
  } catch (error) {
    throw new Error(error);
  }
};

exports.updatePatientMessagesToIsRead = async (patientId) => {
  try {
    return await db.tx(async (task) => {
      await task.none(
        `UPDATE message 
       SET is_read = true
       WHERE created_by_patient_id = $1
    `,
        [patientId]
      );

      return task.oneOrNone(
        `SELECT * FROM v_abbreviated_patient WHERE id = $1`,
        [patientId]
      );
    });
  } catch (error) {
    throw new Error(error);
  }
};

exports.getMessageIndex = async ({ phoneNumber, selectedMessageId }) => {
  try {
    return await db.tx(async (task) => {
      const { rownumber: messageIndex } = await task.one(
        `SELECT rowNumber FROM 
        (SELECT ROW_NUMBER() OVER (ORDER BY v_message."createdAt" DESC) AS rowNumber, id FROM v_message
        WHERE v_message."fromPhoneNumber" = '$1:value'
          OR v_message."toPhoneNumber" = '$1:value') AS rowNumberTable
        WHERE rowNumberTable.id = '$2:value';
        `,
        [phoneNumber, selectedMessageId]
      );

      return { messageIndex };
    }); 
  } catch(error) {
    throw new Error(error);
  }
}

exports.getThread = async ({ phoneNumber, limit }) => {
  try {
    return await db.tx(async (task) => {
      const result = await task.manyOrNone(
        `SELECT * FROM v_message
        WHERE v_message."fromPhoneNumber" = '$1:value'
          OR v_message."toPhoneNumber" = '$1:value'
        ORDER BY v_message."createdAt" DESC
        LIMIT $2:value;
        `,
        [phoneNumber, limit]
      );

      const { total } = await db.oneOrNone(
        `SELECT 
        COUNT(*)::integer AS total 
        FROM v_message 
        WHERE "fromPhoneNumber" = $1
        OR "toPhoneNumber" = $1`,
        [phoneNumber]
      );

      return { result, total };
    });
  } catch (error) {
    throw new Error(error);
  }
};

exports.getMessagesViaQuery = async ({
  keyword = null,
  fromDate = null,
  toDate = null,
  createdByPatient = null,
  createdByProvider = null,
  limit,
}) => {
  try {
    const result = await db.manyOrNone(
      `SELECT 
      *
      FROM v_message
      WHERE
        (
          ($1 IS NULL OR v_message.body ~* $1)
          AND
          ($2 IS NULL OR v_message."createdAt" >= $2::date)
          AND
          ($3 IS NULL OR v_message."createdAt" <= $3::date)
          AND 
          ($4 IS NULL OR v_message."createdByPatient" IS NOT NULL)
          AND 
          ($5 IS NULL OR v_message."createdByProvider" IS NOT NULL)
        )
      ORDER BY v_message."createdAt" DESC

      LIMIT $6
      `,
      [keyword, fromDate, toDate, createdByPatient, createdByProvider, limit]
    );

    const { total } = await db.oneOrNone(
      `SELECT 
        COUNT(*)::integer AS total
        FROM v_message
        WHERE
        (
          ($1 IS NULL OR v_message.body ~* $1)
          AND
          ($2 IS NULL OR v_message."createdAt" >= $2::date)
          AND
          ($3 IS NULL OR v_message."createdAt" <= $3::date)
          AND 
          ($4 IS NULL OR v_message."createdByPatient" IS NOT NULL)
          AND 
          ($5 IS NULL OR v_message."createdByProvider" IS NOT NULL)
        )`,
      [keyword, fromDate, toDate, createdByPatient, createdByProvider]
    );

    return {
      result,
      total,
    };
  } catch (error) {
    throw new Error(error);
  }
};
exports.getLastPatientMessage = async (patientId) => {
  try {
    return db.oneOrNone(
      `SELECT * 
       FROM message 
       WHERE created_by_patient_id = $1 
       ORDER BY created_at DESC LIMIT 1`,
      [patientId]
    );
  } catch (error) {
    throw new Error(error);
  }
};
