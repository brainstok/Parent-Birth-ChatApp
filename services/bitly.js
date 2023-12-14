const axios = require("axios");

exports.getBitlyLink = async (url) => {
  try {
    const { data: response } = await axios.post(
      "https://api-ssl.bitly.com/v4/shorten",
      {
        long_url: url,
        domain: "bit.ly",
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.BITLY_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.link;
  } catch (error) {
    console.log(error.response?.data?.description || error);
    return url;
  }
};
