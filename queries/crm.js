const db = require("../db");

exports.getOptions = async (tableName, where) => {
  const options = await db
    .manyOrNone(
      `SELECT 
        id AS "id", 
        label AS "label" 
        FROM $1:name 
        $2:raw`,
      [tableName, where]
    )
    .then((rows) => {
      return rows ? rows : [];
    })
    .catch((error) => {
      throw new Error(error);
    });
  return options;
};

exports.addOption = async (tableName, label) => {
  await db
    .none(`INSERT INTO $1:name (label) VALUES ($2)`, [tableName, label])
    .then((rows) => {
      return rows;
    })
    .catch((error) => {
      throw new Error(error);
    });
};

const intakeOptionsQuery = `
SELECT 
ARRAY(
SELECT json_build_object(
'id', stage.id,
'label', stage.label)
FROM stage ORDER BY id ASC
) AS "stage",
ARRAY(
SELECT json_build_object(
'id', gender_identity.id,
'label', gender_identity.label)
FROM gender_identity ORDER BY id ASC
) AS "genderIdentity",
ARRAY(
SELECT json_build_object(
'id', has_medical_care_provider.id,
'label', has_medical_care_provider.label)
FROM has_medical_care_provider ORDER BY id ASC
) AS "hasMedicalCareProvider",
ARRAY(
SELECT json_build_object(
'id', has_insurance.id,
'label', has_insurance.label)
FROM has_insurance ORDER BY id ASC
) AS "hasInsurance",
ARRAY(
SELECT json_build_object(
'id', insurance_type.id,
'label', insurance_type.label)
FROM insurance_type ORDER BY id ASC
) AS "insuranceType",
ARRAY(
SELECT json_build_object(
'id', has_childbirth_education_class.id,
'label', has_childbirth_education_class.label)
FROM has_childbirth_education_class ORDER BY id ASC
) AS "hasChildbirthEducationClass",
ARRAY(
SELECT json_build_object(
'id', has_in_person_doula_interest.id,
'label', has_in_person_doula_interest.label)
FROM has_in_person_doula_interest ORDER BY id ASC
) AS "hasInPersonDoulaInterest",
ARRAY(
SELECT json_build_object(
'id', has_first_trimester_visit.id,
'label', has_first_trimester_visit.label)
FROM has_first_trimester_visit ORDER BY id ASC
) AS "hasFirstTrimesterVisit",
ARRAY(
SELECT json_build_object(
'id', has_birth_plan.id,
'label', has_birth_plan.label)
FROM has_birth_plan ORDER BY id ASC
) AS "hasBirthPlan",
ARRAY(
SELECT json_build_object(
'id', postpartum_care_visit.id,
'label', postpartum_care_visit.label)
FROM postpartum_care_visit ORDER BY id ASC
) AS "postpartumCareVisit",
ARRAY(
SELECT json_build_object(
'id', birth_weeks_gestation.id,
'label', birth_weeks_gestation.label)
FROM birth_weeks_gestation ORDER BY id ASC
) AS "birthWeeksGestation",
ARRAY(
SELECT json_build_object(
'id', birth_place.id,
'label', birth_place.label)
FROM birth_place ORDER BY id ASC
) AS "birthPlace",
ARRAY(
SELECT json_build_object(
'id', has_nicu.id,
'label', has_nicu.label)
FROM has_nicu ORDER BY id ASC
) AS "hasNicu",
ARRAY(
SELECT json_build_object(
'id', has_breastfed.id,
'label', has_breastfed.label)
FROM has_breastfed ORDER BY id ASC
) AS "hasBreastfed",
ARRAY(
SELECT json_build_object(
'id', birth_intervention.id,
'label', birth_intervention.label)
FROM birth_intervention ORDER BY id ASC
) AS "birthIntervention",
ARRAY(
SELECT json_build_object(
'id', pmad.id,
'label', pmad.label,
'description', pmad.description)
FROM pmad ORDER BY id ASC
) AS "pmad",
ARRAY(
SELECT json_build_object(
'id', feeding.id,
'label', feeding.label)
FROM feeding ORDER BY id ASC
) AS "feeding",
ARRAY(
SELECT json_build_object(
'id', sdoh.id,
'label', sdoh.label,
'description', sdoh.description)
FROM sdoh ORDER BY id ASC
) AS "sdoh",
ARRAY(
SELECT json_build_object(
'id', has_pmad.id,
'label', has_pmad.label)
FROM has_pmad ORDER BY id ASC
) AS "hasPmad",
ARRAY(
SELECT json_build_object(
'id', amount.id,
'label', amount.label)
FROM amount ORDER BY id ASC
) AS "amount"
`;

const esIntakeOptionsQuery = `SELECT 
ARRAY(
SELECT json_build_object(
'id', stage.id,
'label', stage.es_label)
FROM stage ORDER BY id ASC
) AS "stage",
ARRAY(
SELECT json_build_object(
'id', gender_identity.id,
'label', gender_identity.es_label)
FROM gender_identity ORDER BY id ASC
) AS "genderIdentity",
ARRAY(
SELECT json_build_object(
'id', has_medical_care_provider.id,
'label', has_medical_care_provider.es_label)
FROM has_medical_care_provider ORDER BY id ASC
) AS "hasMedicalCareProvider",
ARRAY(
SELECT json_build_object(
'id', has_insurance.id,
'label', has_insurance.es_label)
FROM has_insurance ORDER BY id ASC
) AS "hasInsurance",
ARRAY(
SELECT json_build_object(
'id', insurance_type.id,
'label', insurance_type.es_label)
FROM insurance_type ORDER BY id ASC
) AS "insuranceType",
ARRAY(
SELECT json_build_object(
'id', has_childbirth_education_class.id,
'label', has_childbirth_education_class.es_label)
FROM has_childbirth_education_class ORDER BY id ASC
) AS "hasChildbirthEducationClass",
ARRAY(
SELECT json_build_object(
'id', has_in_person_doula_interest.id,
'label', has_in_person_doula_interest.es_label)
FROM has_in_person_doula_interest ORDER BY id ASC
) AS "hasInPersonDoulaInterest",
ARRAY(
SELECT json_build_object(
'id', has_first_trimester_visit.id,
'label', has_first_trimester_visit.es_label)
FROM has_first_trimester_visit ORDER BY id ASC
) AS "hasFirstTrimesterVisit",
ARRAY(
SELECT json_build_object(
'id', has_birth_plan.id,
'label', has_birth_plan.es_label)
FROM has_birth_plan ORDER BY id ASC
) AS "hasBirthPlan",
ARRAY(
SELECT json_build_object(
'id', postpartum_care_visit.id,
'label', postpartum_care_visit.es_label)
FROM postpartum_care_visit ORDER BY id ASC
) AS "postpartumCareVisit",
ARRAY(
SELECT json_build_object(
'id', birth_weeks_gestation.id,
'label', birth_weeks_gestation.es_label)
FROM birth_weeks_gestation ORDER BY id ASC
) AS "birthWeeksGestation",
ARRAY(
SELECT json_build_object(
'id', birth_place.id,
'label', birth_place.es_label)
FROM birth_place ORDER BY id ASC
) AS "birthPlace",
ARRAY(
SELECT json_build_object(
'id', has_nicu.id,
'label', has_nicu.es_label)
FROM has_nicu ORDER BY id ASC
) AS "hasNicu",
ARRAY(
SELECT json_build_object(
'id', has_breastfed.id,
'label', has_breastfed.es_label)
FROM has_breastfed ORDER BY id ASC
) AS "hasBreastfed",
ARRAY(
SELECT json_build_object(
'id', birth_intervention.id,
'label', birth_intervention.es_label)
FROM birth_intervention ORDER BY id ASC
) AS "birthIntervention",
ARRAY(
SELECT json_build_object(
'id', pmad.id,
'label', pmad.es_label,
'description', pmad.es_description)
FROM pmad ORDER BY id ASC
) AS "pmad",
ARRAY(
SELECT json_build_object(
'id', feeding.id,
'label', feeding.es_label)
FROM feeding ORDER BY id ASC
) AS "feeding",
ARRAY(
SELECT json_build_object(
'id', sdoh.id,
'label', sdoh.es_label,
'description', sdoh.es_description)
FROM sdoh ORDER BY id ASC
) AS "sdoh",
ARRAY(
SELECT json_build_object(
'id', has_pmad.id,
'label', has_pmad.es_label)
FROM has_pmad ORDER BY id ASC
) AS "hasPmad",
ARRAY(
SELECT json_build_object(
'id', amount.id,
'label', amount.label)
FROM amount ORDER BY id ASC
) AS "amount"`;

exports.getIntakeFormOptions = async (locale) => {
  try {
    let formOptions;

    if (locale === "es") {
      formOptions = await db.oneOrNone(esIntakeOptionsQuery);
    } else {
      formOptions = await db.oneOrNone(intakeOptionsQuery);
    }

    return formOptions;
  } catch (error) {
    throw new Error(error);
  }
};

exports.getTransitionFormOptions = async () => {
  try {
    const formOptions = await db.oneOrNone(`
    SELECT
    ARRAY(
    SELECT json_build_object(
    'id', postpartum_care_visit.id,
    'label', postpartum_care_visit.label)
    FROM postpartum_care_visit ORDER BY id ASC
    ) AS "postpartumCareVisit",
    ARRAY(
    SELECT json_build_object(
    'id', birth_place.id,
    'label', birth_place.label)
    FROM birth_place ORDER BY id ASC
    ) AS "birthPlace",
    ARRAY(
    SELECT json_build_object(
    'id', birth_weeks_gestation.id,
    'label', birth_weeks_gestation.label)
    FROM birth_weeks_gestation ORDER BY id ASC
    ) AS "birthWeeksGestation",
    ARRAY(
    SELECT json_build_object(
    'id', birth_intervention.id,
    'label', birth_intervention.label)
    FROM birth_intervention ORDER BY id ASC
    ) AS "birthIntervention",
    ARRAY(
    SELECT json_build_object(
    'id', has_nicu.id,
    'label', has_nicu.label)
    FROM has_nicu ORDER BY id ASC
    ) AS "hasNicu",    
    ARRAY(
    SELECT json_build_object(
    'id', has_pmad.id,
    'label', has_pmad.label)
    FROM has_pmad ORDER BY id ASC
    ) AS "hasPmad",
    ARRAY(
    SELECT json_build_object(
    'id', pmad.id,
    'label', pmad.label)
    FROM pmad ORDER BY id ASC
    ) AS "pmad",    
    ARRAY(
    SELECT json_build_object(
    'id', feeding.id,
    'label', feeding.label)
    FROM feeding ORDER BY id ASC
    ) AS "feeding",
    ARRAY(
    SELECT json_build_object(
    'id', has_breastfed.id,
    'label', has_breastfed.label)
    FROM has_breastfed ORDER BY id ASC
    ) AS "hasBreastfed",
    ARRAY(
    SELECT json_build_object(
    'id', has_in_person_doula_interest.id,
    'label', has_in_person_doula_interest.label)
    FROM has_in_person_doula_interest ORDER BY id ASC
    ) AS "hasInPersonDoulaInterest"`);
    return formOptions;
  } catch (error) {
    throw new Error(error);
  }
};

const signupOptionsQuery = `
SELECT 
ARRAY(
SELECT json_build_object(
'id', ethnic_identity.id,
'label', ethnic_identity.label)
FROM ethnic_identity ORDER BY id ASC
) AS "ethnicIdentity",
ARRAY(
SELECT json_build_object(
'id', age_range.id,
'label', age_range.label)
FROM age_range ORDER BY id ASC
) AS "ageRange",
ARRAY(
SELECT json_build_object(
'id', stage.id,
'label', stage.label)
FROM stage 
WHERE stage.id != (SELECT id FROM stage WHERE label ='Parent')
AND stage.id != (SELECT id FROM stage WHERE label ='Miscarriage/Loss')
ORDER BY id ASC 
) AS "stage"`;

const esSignupOptionsQuery = `
SELECT 
ARRAY(
SELECT json_build_object(
'id', ethnic_identity.id,
'label', ethnic_identity.es_label)
FROM ethnic_identity ORDER BY id ASC
) AS "ethnicIdentity",
ARRAY(
SELECT json_build_object(
'id', age_range.id,
'label', age_range.es_label)
FROM age_range ORDER BY id ASC
) AS "ageRange",
ARRAY(
SELECT json_build_object(
'id', stage.id,
'label', stage.es_label)
FROM stage 
WHERE stage.id != (SELECT id FROM stage WHERE label ='Parent')
AND stage.id != (SELECT id FROM stage WHERE label ='Miscarriage/Loss')
ORDER BY id ASC 
) AS "stage"

`;

exports.getSignupFormOptions = async (locale) => {
  try {
    let formOptions;

    if (locale === "es") {
      formOptions = await db.oneOrNone(esSignupOptionsQuery);
    } else {
      formOptions = await db.oneOrNone(signupOptionsQuery);
    }

    return formOptions;
  } catch (error) {
    throw new Error(error);
  }
};
