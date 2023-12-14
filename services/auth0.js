const axios = require("axios");

exports.signUpUser = async (user) => {
  try {
    const { data: newUser } = await axios.post(
      `${process.env.AUTH0_DOMAIN}/dbconnections/signup`,
      {
        ...user,
        connection: process.env.AUTH0_DATABASE_CONNECTION,
        client_id: process.env.AUTH0_CLIENT_ID,
      }
    );
    return newUser;
  } catch (error) {
    let errorMessage = error.message;
    if (error.response.data) {
      errorMessage =
        error.response.data.message || error.response.data.description;
    }
    console.log(`Error in signUpUser: ${errorMessage}`);
    throw new Error(errorMessage);
  }
};
