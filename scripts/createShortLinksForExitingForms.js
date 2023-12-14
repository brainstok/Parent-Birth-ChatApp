require("dotenv").config();
const { eachOfSeries } = require("async");
const delay = require("delay");
const {
  updatePatientForm,
  getPatientsFormData,
} = require("../queries/patient");
const { getBitlyLink } = require("../services/bitly");

const createFormLink = ({ baseUrl, form }) => {
  const formName = form.formType.toLowerCase();

  return `${baseUrl}/${formName}?formId=${form.id}`;
};

const createShortLinksForExitingForms = async () => {
  const forms = await getPatientsFormData();

  console.log(`Creating forms for ${forms.length} forms`);

  console.log(forms);

  await eachOfSeries(forms, async (form) => {
    const link = createFormLink({
      baseUrl: "https://parentbirth.com",
      form,
    });

    const shortLink = await getBitlyLink(link);

    await updatePatientForm({ link, patientFormId: form.id, shortLink });
    console.log(`Successfully updated form id ${form.id}`);

    // Waiting a bit bitly not to get mad
    await delay(2000);
  });
};

createShortLinksForExitingForms();
