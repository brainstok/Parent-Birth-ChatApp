const sgMail = require("@sendgrid/mail");
const client = require("@sendgrid/client");
const axios = require("axios");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
client.setApiKey(process.env.SENDGRID_API_KEY);

const createMessage = ({ email }) => {
  return {
    to: email,
    from: "hello@wearerobyn.co",
    template_id: "d-beb431168b134360a292d01add18c8e1",
  };
};

module.exports.sendConfirmationEmail = async ({ email }) => {
  try {
    return await sgMail.send(createMessage({ email }));
  } catch (error) {
    console.log("Error @ sendConfirmationEmail", error);

    if (error.response) {
      console.error("Error @ sendConfirmationEmail", error.response.body);
    }
  }
};

module.exports.sendPatientToNewsletterList = async ({
  firstName,
  email,
  source,
  type,
}) => {
  const body = JSON.stringify({
    list_ids: ["327aebb1-94e5-4e99-8901-b2a61ce961e4"],
    contacts: [
      {
        first_name: firstName || "",
        email,
        custom_fields: {
          e17_T: source,
          e18_T: type,
        },
      },
    ],
  });
  const request = {
    method: "PUT",
    url: "/v3/marketing/contacts",
    body,
  };

  return client
    .request(request)
    .then(() => {
      console.log("Patient added to newsletter list");
    })
    .catch((error) => {
      console.log("Error @ sendPatientToNewsletterList: ", error);
    });
};

module.exports.sendGuideEmail = async ({
  email,
  guideTitle,
  guideUrl,
  guideSlug,
}) => {
  try {
    const img_encoding = await axios
      .get(guideUrl, { responseType: "arraybuffer" })
      .then((res) => Buffer.from(res.data, "binary").toString("base64"));

    const msg = {
      to: email,
      from: "hello@wearerobyn.co",
      template_id: "d-2422a38d15b046f5be6ef63d7e18da17",
      attachments: [
        {
          content: img_encoding,
          filename: `${guideSlug}.pdf`,
          type: "application/pdf",
          disposition: "attachment",
        },
      ],
      personalizations: [
        {
          to: [
            {
              email: email,
            },
          ],
          dynamic_template_data: {
            guideTitle,
          },
        },
      ],
    };

    await sgMail.send(msg).then((response) => {
      console.log("Sent guide");
    });
  } catch (error) {
    console.log("Error @ sendGuideEmail", error);
    return error;
  }
};
