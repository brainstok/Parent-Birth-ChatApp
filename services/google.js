const axios = require("axios");

module.exports.getCityStateFromZip = async (zipCode) => {
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json`,
      {
        params: {
          components: `postal_code:${zipCode}`,
          key: process.env.GOOGLE_API_KEY,
        },
      }
    );

    let city = null;
    let state = null;

    if (response.data.status === "ZERO_RESULTS") {
      console.error(`Error @ getCityStateFromZip => ${response.data.status}`);
      return { city, state };
    }

    const { address_components: addressComponents } = response.data.results[0];

    city = addressComponents.find((component) =>
      component.types.includes("locality")
    )?.long_name;
    state = addressComponents.find((component) =>
      component.types.includes("administrative_area_level_1")
    )?.long_name;

    return { city, state };
  } catch (error) {
    console.error(`Error @ getCityStateFromZip => ${error.message}`);
    return null;
  }
};
