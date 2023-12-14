const axios = require("axios");

module.exports.getContact = async (phoneNumber) => {
  try {
    const body = {
      query: `{ items_by_column_values(board_id: ${1793615381}, column_id: text50, column_value:  \"${phoneNumber}\") {
          id
          name
        } 
       }`,
    };
    const { data } = await axios.post("https://api.monday.com/v2", body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: process.env.MONDAY_API_KEY,
      },
    });

    return data.data.items_by_column_values[0] || null;
  } catch (error) {
    console.log(error);
  }
};

module.exports.updateContact = async (values) => {
  const { contactId, status } = values;
  try {
    const body = {
      query: `mutation ($itemId: Int!, $boardId: Int!, $columnValues: JSON!) {
                change_multiple_column_values (
                  item_id: $itemId,
                  board_id: $boardId, 
                  column_values: $columnValues
               ) {id}
              }`,
      variables: {
        itemId: parseInt(contactId),
        boardId: 1793615381,
        columnValues: JSON.stringify({
          status55: { label: status },
        }),
      },
    };
    const { data } = await axios.post("https://api.monday.com/v2", body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: process.env.MONDAY_API_KEY,
      },
    });

    console.log(data);
  } catch (error) {
    console.log(error);
  }
};

module.exports.createContact = async (values) => {
  const {
    subscriptionDate,
    firstName,
    lastName,
    phoneNumber,
    email,
    stage,
    birthDueDate,
    birthDate,
    age,
    ethnicIdentity,
    zipCode,
    genderIdentity,
    barriersToCare,
    intakeFormLink,
    postpartumFollowUpFormLink,
    partner,
  } = values;

  try {
    const body = {
      query: `mutation (
        $boardId: Int!, 
        $groupId: String!, 
        $itemName: String!, 
        $columnValues: JSON!) {
              create_item (
                board_id: $boardId, 
                group_id: $groupId, 
                item_name: $itemName,
                column_values: $columnValues
             ) {id}
            }`,
      variables: {
        boardId: 1793615381,
        groupId: "topics",
        itemName: `${firstName} ${lastName}`,
        columnValues: JSON.stringify({
          text50: phoneNumber,
          email: { email, text: email },
          text5: intakeFormLink,
          date: subscriptionDate,
          dropdown: stage,
          date8: birthDueDate,
          dup__of_birth_due_date: birthDate,
          dropdown9: age,
          identity: ethnicIdentity ? { labels: [ethnicIdentity] } : undefined,
          zip_code1: zipCode,
          dropdown8: genderIdentity,
          // Multiple Choice
          dropdown6: barriersToCare ? { labels: barriersToCare } : undefined,
          text05: postpartumFollowUpFormLink,
          // Default sets new contsact to "Active"
          status55: { label: "Active" },
          text4: partner,
        }),
      },
    };

    const { data } = await axios.post("https://api.monday.com/v2", body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: process.env.MONDAY_API_KEY,
      },
    });

    console.log("data ==> ", data);

    if (data.error_message) {
      // Stop Loss: If there's an error in the formatting send contact to slack channelsendContact
      sendContact({
        ...values,
        errorMessage: data.error_message,
        subject: "Unable to add Contact to Monday.com",
      });
    }

    return data.data?.create_item?.id;
  } catch (error) {
    console.log(error);
  }
};
