const axios = require("axios");

exports.getResources = async () => {
  try {
    const { data: response } = await axios.get(
      `${process.env.CMS_BASE_URL}/api/resources?populate[0]=resource_topic&populate[1]=resource_subtopics`,
      {
        headers: {
          authorization: `Bearer ${process.env.CMS_BASE_TOKEN}`,
        },
      }
    );

    return response?.data;
  } catch (error) {
    // console.log(error);
    throw new Error(error);
  }
};

exports.getResource = async (resourceId) => {
  try {
    const { data: response } = await axios.get(
      `${process.env.CMS_BASE_URL}/api/resources/${resourceId}?populate[0]=resource_topic&populate[1]=resource_subtopics`,
      {
        headers: {
          authorization: `Bearer ${process.env.CMS_BASE_TOKEN}`,
        },
      }
    );

    return response?.data;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

exports.searchResources = async (query) => {
  try {
    const { data: response } = await axios.get(
      `${process.env.CMS_BASE_URL}/api/fuzzy-search/search?query=${query}`,
      {
        headers: {
          authorization: `Bearer ${process.env.CMS_BASE_TOKEN}`,
        },
      }
    );

    return response?.resources;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

exports.getResourceTopics = async () => {
  try {
    const { data: response } = await axios.get(
      `${process.env.CMS_BASE_URL}/api/resource-topics`,
      {
        headers: {
          authorization: `Bearer ${process.env.CMS_BASE_TOKEN}`,
        },
      }
    );

    return response?.data;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

exports.getResourceSubtopics = async (topicId) => {
  try {
    const { data: response } = await axios.get(
      `${process.env.CMS_BASE_URL}/api/resource-subtopics?filters[resource_topic][id][$eq]=${topicId}`,
      {
        headers: {
          authorization: `Bearer ${process.env.CMS_BASE_TOKEN}`,
        },
      }
    );

    return response?.data;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

exports.getDoulas = async (queryString = "") => {
  try {
    const { data: response } = await axios.get(
      `${process.env.CMS_BASE_URL}/api/doulas?${queryString}`,
      {
        headers: {
          authorization: `Bearer ${process.env.CMS_BASE_TOKEN}`,
        },
      }
    );
    return response;
  } catch (error) {
    throw new Error(error);
  }
};
