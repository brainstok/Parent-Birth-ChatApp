exports.deletePatientQueryString = `
UPDATE message SET created_by_patient_id = null WHERE created_by_patient_id = $1;
DELETE FROM draft_message WHERE patient_id = $1;
DELETE FROM patient_form WHERE patient_id = $1;
DELETE FROM patient_sdoh WHERE patient_id = $1;
DELETE FROM patient_feeding WHERE patient_id = $1;
DELETE FROM patient_birth_intervention WHERE patient_id = $1;
DELETE FROM patient_subtopic WHERE patient_id = $1;
DELETE FROM patient_topic WHERE patient_id = $1;
DELETE FROM patient_subtopic WHERE patient_id = $1;
DELETE FROM patient_topic WHERE patient_id = $1;
DELETE FROM provider_note_tag 
WHERE patient_note_id IN (SELECT id FROM patient_note WHERE patient_id = $1);
DELETE FROM patient_note WHERE patient_id = $1;
DELETE FROM patient_event WHERE patient_id = $1;
DELETE FROM patient_pmad WHERE patient_id = $1;
DELETE FROM patient WHERE id = $1;
`;

exports.getPatientFormsQuery = `
SELECT 
patient_form.id AS "id",
patient_form.is_completed AS "isCompleted",
patient_form.short_link AS "shortLink",
patient_form.link AS "link",
form_type.label AS "formType",
json_build_object(
'id', patient.id,
'firstName', patient.first_name,
'signupStageId', stage.id
) AS "patient"
FROM 
patient_form 
LEFT JOIN patient 
ON patient.id = patient_form.patient_id
LEFT JOIN stage
ON patient.signup_stage_id = stage.id
LEFT JOIN form_type
ON form_type.id = patient_form.form_type_id`;
