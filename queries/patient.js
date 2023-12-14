const db = require("../db");
const pgp = require("pg-promise")();
const { getBitlyLink } = require("../services/bitly");
const {
  deletePatientQueryString,
  getPatientFormsQuery,
} = require("./queryStrings");
const { eachOfSeries } = require("async");
const createColumnPairsArrayFromObject = require("../utils/createColumnPairsArrayFromObject");
const addSubTopics = require("../utils/addSubTopics");

exports.getPatients = async () => {
  try {
    return await db.manyOrNone(
      `
    SELECT * FROM v_abbreviated_patient 
    WHERE status = $1`,
      ["Active"]
    );
  } catch (error) {
    throw new Error(error);
  }
};

exports.getPatient = async (patientId) => {
  try {
    return await db.oneOrNone(`SELECT * FROM v_patient WHERE id = $1`, [
      patientId,
    ]);
  } catch (error) {
    throw new Error(error);
  }
};

exports.deletePatient = async (patientId) => {
  try {
    await db.none(deletePatientQueryString, [patientId]);
  } catch (error) {
    throw new Error(error);
  }
};

exports.getPatientViaPhoneNumber = async (phoneNumber) => {
  try {
    return await db.oneOrNone(
      `SELECT * FROM v_abbreviated_patient WHERE v_abbreviated_patient."phoneNumber" = $1`,
      [phoneNumber]
    );
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.getThreadPatient = async (phoneNumber) => {
  try {
    return await db.oneOrNone(
      `
    
      SELECT * FROM v_thread_patient

      WHERE v_thread_patient."phoneNumber" = $1
    `,
      [phoneNumber]
    );
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.getThreadPatients = async (limit) => {
  try {
    return await db.task(async (task) => {
      const result = await task.manyOrNone(
        `
        SELECT 
        * FROM v_thread_patient
        WHERE v_thread_patient."lastMessage" ->> 'id' IS NOT null
        LIMIT $1
      `,
        [limit]
      );

      const { total } = await task.oneOrNone(`
        SELECT 
        COUNT(*)::integer AS total
        FROM v_thread_patient 
        WHERE v_thread_patient."lastMessage" ->> 'id' IS NOT null
        `);

      return {
        result,
        total,
      };
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.createPatient = async ({
  firstName,
  email,
  phoneNumber,
  zipCode,
  ageRangeId,
  ethnicIdentityId,
  stageId,
  babyEstimatedDueDate,
  babyBirthDate,
  statusId,
  city,
  state,
  locale,
}) => {
  try {
    return await db.task(async (task) => {
      const patient = await task.oneOrNone(
        `INSERT INTO patient(
            first_name,
            email,
            phone_number,
            signup_stage_id,
            current_stage_id,
            zip_code,
            age_range_id,
            ethnic_identity_id,
            baby_estimated_due_date,
            baby_birth_date,
            status_id,
            city,
            state, locale)
            VALUES
            ($1,
             $2,
             $3,
             $4,
             $5,
             $6,
             $7,
             $8,
             $9,
             $10,
             $11,
             $12,
             $13, $14)
             RETURNING 
             id,
             first_name AS "firstName",
             status_id AS "statusId",
             current_stage_id AS "currentStageId",
             phone_number AS "phoneNumber";`,
        [
          firstName,
          email,
          phoneNumber,
          stageId,
          stageId,
          zipCode,
          ageRangeId,
          ethnicIdentityId,
          babyEstimatedDueDate,
          babyBirthDate,
          statusId,
          city,
          state,
          locale,
        ]
      );

      const { id: patientId, firstName: patientFirstName } = patient;

      const displayName = `${patientFirstName}-${patientId}`;

      // Create Display Name for privacy reason
      await task.oneOrNone(
        `UPDATE patient 
         SET display_name = $2
         WHERE id = $1
       `,
        [patientId, displayName]
      );

      const newPatient = task.oneOrNone(
        `SELECT * FROM v_abbreviated_patient WHERE id = $1`,
        [patientId]
      );

      return newPatient;
    });
  } catch (error) {
    console.log(error);
  }
};

exports.updatePatient = async ({ patientId, ...updateValues }) => {
  try {
    const columnValuePairs = createColumnPairsArrayFromObject({
      ...updateValues,
    });

    return await db.tx(async (task) => {
      for (const pair of columnValuePairs) {
        await task.none(
          `UPDATE patient
           SET $2:name = $3
           WHERE id = $1`,
          [patientId, pair[0], pair[1]]
        );
      }

      return await task.oneOrNone(`SELECT * FROM v_patient WHERE id = $1`, [
        patientId,
      ]);
    });
  } catch (error) {
    throw new Error(error);
  }
};

exports.addPatientCrmOption = async ({
  joinTableName,
  optionTableName,
  optionIdName,
  optionId,
  patientId,
}) => {
  return await db
    .tx((t) => {
      const insertOptionQ = t.none(
        `INSERT INTO $1:name (patient_id, $2:name) VALUES ($3:value, $4:value)`,
        [joinTableName, optionIdName, patientId, optionId]
      );
      const selectOptionsQ = t.many(
        `SELECT
         $3:value AS "id",
         $4:value AS "label"
         FROM $1:name
         JOIN $2:name
         ON $5:value = $3:value
         WHERE 
         patient_id = $6:value;`,
        [
          joinTableName,
          optionTableName,
          `${optionTableName}.id`,
          `${optionTableName}.label`,
          `${optionTableName}_id`,
          patientId,
        ]
      );
      return t.batch([insertOptionQ, selectOptionsQ]);
    })
    .then((results) => {
      // Return result from select query
      return results[1];
    })
    .catch((error) => {
      throw new Error(error);
    });
};

exports.deletePatientCrmOption = async ({
  joinTableName,
  optionTableName,
  optionIdName,
  optionId,
  patientId,
}) => {
  return await db
    .tx((t) => {
      const deleteOptionQ = t.none(
        `DELETE FROM $1:name WHERE patient_id = $2:value AND $3:value = $4:value`,
        [joinTableName, patientId, optionIdName, optionId]
      );
      const selectOptionsQ = t.manyOrNone(
        `SELECT
       $3:value AS "id",
       $4:value AS "label"
       FROM $1:name
       JOIN $2:name
       ON $5:value = $3:value
       WHERE 
       patient_id = $6:value;`,
        [
          joinTableName,
          optionTableName,
          `${optionTableName}.id`,
          `${optionTableName}.label`,
          `${optionTableName}_id`,
          patientId,
        ]
      );
      return t.batch([deleteOptionQ, selectOptionsQ]);
    })
    .then((results) => {
      // Return result from select query
      return results[1];
    })
    .catch((error) => {
      throw new Error(error);
    });
};

exports.updatePatientForm = async ({ patientFormId, ...rest }) => {
  try {
    const columnValuePairs = createColumnPairsArrayFromObject(rest);

    return await db.task(async (task) => {
      for (const pair of columnValuePairs) {
        await task.none(
          `UPDATE patient_form
           SET $2:name = $3
           WHERE id = $1`,
          [patientFormId, pair[0], pair[1]]
        );
      }

      const updatedForm = await task.oneOrNone(
        `SELECT
        patient_form.id AS "id",
        form_type.label AS "label",
        created_at AS "createdAt",
        is_sent AS "isSent",
        is_completed AS "isCompleted",
        link AS "link",
        short_link AS "shortLink"
        FROM patient_form
        LEFT JOIN form_type on form_type.id = patient_form.form_type_id
        WHERE patient_form.id = $1`,
        [patientFormId]
      );

      return updatedForm;
    });
  } catch (error) {
    throw new Error(error);
  }
};

exports.createPatientNote = async ({
  providerId,
  patientId,
  body,
  taggedProviderIds,
}) => {
  try {
    return await db.task(async (task) => {
      const { id: noteId } = await task.oneOrNone(
        `INSERT INTO patient_note
          (body, 
          provider_id, 
          patient_id)
          VALUES
          ($1,
           $2,
           $3)
           RETURNING id;`,
        [body, providerId, patientId]
      );

      await eachOfSeries(taggedProviderIds, async (providerId) => {
        try {
          await task.none(
            `INSERT INTO provider_note_tag (patient_note_id, provider_id)
              VALUES
              ($1, $2);`,
            [noteId, providerId]
          );
        } catch (error) {
          throw new Error(error);
        }
      });

      const notes = await task.many(
        `SELECT * FROM v_patient_note WHERE "patientId" = $1
        ORDER BY  "createdAt" DESC`,
        [patientId]
      );

      return notes;
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.updatePatientNote = async ({
  noteId,
  patientId,
  body = "",
  isCompleted = "",
  taggedProviderIds = [],
}) => {
  try {
    return await db.task(async (task) => {
      await task.none(
        `UPDATE patient_note 
         SET
         body = COALESCE(NULLIF($2, ''), body)
         WHERE id = $1:value;`,
        [noteId, body, isCompleted]
      );

      if (Boolean(taggedProviderIds.length)) {
        // Delete exiting relationships

        await task.none(
          "DELETE FROM provider_note_tag WHERE patient_note_id = $1",
          [noteId]
        );

        await eachOfSeries(taggedProviderIds, async (providerId) => {
          try {
            await task.none(
              `INSERT INTO provider_note_tag (patient_note_id, provider_id)
                VALUES
                ($1, $2);`,
              [noteId, providerId]
            );
          } catch (error) {
            throw new Error(error);
          }
        });
      }

      const notes = await task.many(
        `SELECT * FROM v_patient_note WHERE "patientId" = $1
         ORDER BY  "createdAt" DESC`,
        [patientId]
      );

      return notes;
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.deletePatientNote = async ({ patientId, noteId }) => {
  try {
    return await db.task(async (task) => {
      await task.none(
        "DELETE FROM provider_note_tag WHERE patient_note_id = $1",
        [noteId]
      );

      await task.none(
        `DELETE FROM patient_note
         WHERE patient_id = $1:value AND id = $2:value`,
        [patientId, noteId]
      );

      const notes = await task.manyOrNone(
        `SELECT * FROM v_patient_note WHERE "patientId" = $1
        ORDER BY  "createdAt" DESC`,
        [patientId]
      );
      return notes;
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.createPatientEvent = async ({ providerId, patientId, eventTypeId }) => {
  try {
    return await db.task(async (task) => {
      await task.none(
        `INSERT INTO patient_event
          (event_type_id, 
          provider_id, 
          patient_id)
          VALUES
          ($1,
           $2,
           $3);`,
        [eventTypeId, providerId, patientId]
      );

      const events = await task.many(
        `SELECT * FROM v_patient_event WHERE "patientId" = $1`,
        [patientId]
      );

      return events;
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.deletePatientEvent = async ({ patientId, eventId }) => {
  try {
    return await db.task(async (task) => {
      await task.none(
        `DELETE FROM patient_event
         WHERE patient_id  = $1:value AND id = $2:value;`,
        [patientId, eventId]
      );
      const events = await task.manyOrNone(
        `SELECT * FROM v_patient_event WHERE "patientId" = $1`,
        [patientId]
      );
      return events;
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.updatePatientEvent = async ({
  eventId,
  patientId,
  createdAt,
  eventTypeId,
}) => {
  try {
    return await db.task(async (task) => {
      await task.none(
        `UPDATE patient_event 
         SET 
         created_at = $1,
         event_type_id = $2
         WHERE patient_event.id = $3:value AND patient_event.patient_id = $4:value;`,
        [createdAt, eventTypeId, eventId, patientId]
      );

      const events = await task.many(
        `SELECT * FROM v_patient_event WHERE "patientId" = $1`,
        [patientId]
      );

      return events;
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.updatePatientProvider = async ({ patientId, providerId }) => {
  try {
    return await db.oneOrNone(
      `UPDATE patient
       SET provider_id = $1
       WHERE id = $2:value; `,
      [providerId, patientId]
    );
  } catch (error) {
    throw new Error(error);
  }
};

exports.updatePatientDate = async ({ dateColumn, date, patientId }) => {
  try {
    return await db.none(
      `UPDATE patient
       SET $1:value = $2
       WHERE id = $3; `,
      [dateColumn, date, patientId]
    );
  } catch (error) {
    throw new Error(error);
  }
};

exports.updatePatientLastMessageId = async ({ patientId, lastMessageId }) => {
  try {
    return await db.task(async (task) => {
      await task.none(
        `UPDATE patient
         SET last_message_id = $2
         WHERE id = $1`,
        [patientId, lastMessageId]
      );

      return await task.oneOrNone(
        `SELECT 
          patient.id AS "id",
          first_name AS "firstName", 
          phone_number AS "phoneNumber",
          email AS "email",
          json_build_object(
          'id', message.id,
          'body', message.body,
          'isRead', message.is_read
          ) AS "lastMessage"
          FROM patient 
          LEFT JOIN message
          ON message.id = patient.last_message_id
          WHERE patient.id = $1`,
        [patientId]
      );
    });
  } catch (error) {
    throw new Error(error);
  }
};

exports.createPatientCrmOption = async ({
  patientId,
  joinTableName,
  optionIdName,
  optionId,
}) => {
  return await db
    .task(async (task) => {
      await task.none(
        `INSERT INTO $1:name (patient_id, $2:name) VALUES ($3:value, $4:value)`,
        [joinTableName, optionIdName, patientId, optionId]
      );
    })
    .catch((error) => {
      throw new Error(error);
    });
};

exports.addPatientTopic = async ({ topic, subtopics, patientId }) => {
  try {
    return await db.task(async (task) => {
      const { id: topicId } = topic;
      const { id: patientTopicId } = await task.oneOrNone(
        `INSERT INTO patient_topic 
          (patient_id,
          topic_id)
          VALUES
          ($1,
           $2)
          RETURNING id`,
        [patientId, topicId]
      );

      await addSubTopics({ patientId, patientTopicId, subtopics });
    });
  } catch (error) {
    throw new Error(error);
  }
};

exports.getPatientTopics = async (patientId) => {
  try {
    return await db.manyOrNone(
      `SELECT
        patient_topic.id AS "id",
        patient_topic.topic_id AS "topicId",
        (SELECT label FROM topic WHERE topic.id = patient_topic.topic_id) AS "label",
        (SELECT ARRAY(
        SELECT json_build_object(
        'id', patient_subtopic.subtopic_id,
        'label', (SELECT label FROM subtopic WHERE subtopic.id = patient_subtopic.subtopic_id),
        'topicId', (SELECT topic_id FROM subtopic WHERE subtopic.id = patient_subtopic.subtopic_id)
        )
        FROM patient_subtopic
        WHERE patient_topic.topic_id = (SELECT topic_id FROM subtopic WHERE subtopic.id = patient_subtopic.subtopic_id)
        AND patient_topic.id = patient_subtopic.patient_topic_id
        )) AS "subtopics"
        FROM patient_topic
        WHERE patient_topic.patient_id = $1
    `,
      [patientId]
    );
  } catch (error) {
    throw new Error(error);
  }
};

module.exports.deletePatientTopic = async (patientTopicId) => {
  try {
    return await db.task(async (task) => {
      await task.oneOrNone(
        `DELETE FROM patient_subtopic
         WHERE patient_topic_id = $1`,
        [patientTopicId]
      );

      await task.oneOrNone(
        `DELETE FROM patient_topic 
         WHERE id = $1`,
        [patientTopicId]
      );
    });
  } catch (error) {
    throw new Error(error);
  }
};

module.exports.updatePatientTopic = async ({
  patientId,
  patientTopicId,
  topic,
  subtopics,
}) => {
  try {
    return await db.task(async (task) => {
      await task.none(
        `UPDATE patient_topic
         SET topic_id = $1
         WHERE id = $2`,
        [topic.topicId, topic.id]
      );

      await task.oneOrNone(
        `DELETE FROM patient_subtopic
         WHERE patient_topic_id = $1`,
        [patientTopicId]
      );

      await addSubTopics({ patientId, patientTopicId, subtopics });
    });
  } catch (error) {
    throw new Error(error);
  }
};

exports.createPatientForm = async ({ formTypeId, patientId }) => {
  try {
    return await db.task(async (task) => {
      const { id: patientFormId } = await task.oneOrNone(
        `INSERT INTO patient_form 
        (form_type_id, 
        patient_id) 
        VALUES 
        ($1, $2 ) 
        RETURNING id`,
        [formTypeId, patientId]
      );

      const { label } = await task.oneOrNone(
        `SELECT label FROM form_type WHERE id = $1`,
        [formTypeId]
      );

      const formName = label.toLowerCase();

      const link = `${process.env.FORM_BASE_URL}/${formName}?formId=${patientFormId}`;

      let shortLink = link;
      if (process.env.NODE_ENV === "production") {
        shortLink = await getBitlyLink(link);
      }

      await task.none(
        `UPDATE patient_form
         SET 
          link = $2, 
          short_link = $3
         WHERE id = $1`,
        [patientFormId, link, shortLink]
      );

      const form = await task.oneOrNone(
        `SELECT 
		  short_link AS "shortLink",
		  patient_id AS "patientId"
		  FROM patient_form WHERE id = $1`,
        [patientFormId]
      );

      return { form, patientFormId };
    });
  } catch (error) {
    throw new Error(error);
  }
};

exports.getPatientsFormData = async () => {
  return await db.many(getPatientFormsQuery);
};

exports.getPatientFormData = async (formId) => {
  try {
    const whereFormId = pgp.as.format("WHERE patient_form.id = $1", [formId]);

    return await db.oneOrNone(
      `$1:raw
       $2:raw`,
      [getPatientFormsQuery, whereFormId]
    );
  } catch (error) {
    throw new Error(error);
  }
};

exports.getPatientExport = async () => {
  try {
    return await db.task(async (task) => {
      const patients = await task.manyOrNone(`
      SELECT 
      *,
      (SELECT COUNT(*)::int FROM message WHERE message.created_by_patient_id = v_patient.id) AS "inboundMessagesCount"
      FROM v_patient
      `);
      return patients;
    });
  } catch (error) {
    throw new Error(error);
  }
};

exports.getRecentSignUps = async (days) => {
  try {
    return await db.task(async (task) => {
      const patients = await task.manyOrNone(
        `
        SELECT "zipCode", "city", "state" 
        FROM v_abbreviated_patient 
        WHERE "createdAt" > CURRENT_DATE - interval '$1 days' 
        AND "zipCode" IS NOT null
        LIMIT 20`,
        [days]
      );
      return patients;
    });
  } catch (error) {
    throw new Error(error);
  }
};

exports.getSpanishPatients = async () => {
  try {
    return db.manyOrNone(
      `
      SELECT *  FROM v_patient
      WHERE 
      (v_patient."status" ->> 'id')::integer = 1
      AND (v_patient."ethnicIdentity" = 'Latino, Hispanic'
      OR v_patient."ethnicIdentity" = 'Prefer Not to Answer')`
    );
  } catch (error) {
    throw new Error(error);
  }
};

exports.upsertPatientMessageDraft = async ({ body, patientId }) => {
  try {
    return db.oneOrNone(
      `INSERT INTO draft_message 
        (body, patient_id)
        VALUES ($1, $2)
        ON CONFLICT (patient_id) DO UPDATE SET body = $1`,
      [body, patientId]
    );
  } catch (error) {
    throw new Error(error);
  }
};

exports.getPatientMessageDraft = async (patientId) => {
  try {
    const draft = await db.oneOrNone(
      `SELECT
      patient_id AS "patientId",
      body
      FROM draft_message WHERE patient_id = $1`,
      [patientId]
    );

    return draft;
  } catch (error) {
    throw new Error(error);
  }
};

exports.deletePatientMessageDraft = async (patientId) => {
  try {
    return await db.none(`DELETE FROM draft_message WHERE patient_id = $1`, [
      patientId,
    ]);
  } catch (error) {
    throw new Error(error);
  }
};
