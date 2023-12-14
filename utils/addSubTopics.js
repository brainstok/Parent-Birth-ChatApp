const db = require("../db");
const { eachOfSeries } = require("async");

const addSubTopics = async ({ patientId, patientTopicId, subtopics }) => {
    return await db.task(async (task) => {
        await eachOfSeries(subtopics, async ({ id: subtopicId }) => {
            try {
                await task.oneOrNone(
                    `INSERT INTO patient_subtopic
                        (patient_id,
                        subtopic_id,
                        patient_topic_id)
                        VALUES
                        ($1,
                        $2,
                        $3)
                        RETURNING id`,
                    [patientId, subtopicId, patientTopicId]
                );
            } catch (error) {
                throw new Error(error);
            }
        });
    })
}

module.exports = addSubTopics;
