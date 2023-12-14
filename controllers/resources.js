const {
  getResources,
  getResource,
  searchResources,
  getResourceTopics,
  getResourceSubtopics,
} = require("../services/cms");
const camelcaseKeys = require("camelcase-keys");

exports.handleGetResource = async (resourceId) => {
  try {
    const rawResponse = await getResource(resourceId);

    if (!rawResponse) throw new Error("Not found");

    return camelcaseKeys(rawResponse, { deep: true });
  } catch (error) {
    throw new Error(error);
  }
};

exports.handleGetResources = async (query) => {
  try {
    const { topicId, subtopicIds, keyword } = query;

    let response = [];

    if (keyword) {
      const rawResponse = await searchResources(keyword);
      response = camelcaseKeys(rawResponse, { deep: true });
    } else {
      const rawResponse = await getResources();
      response = camelcaseKeys(rawResponse, { deep: true });
    }

    let resources = response;

    if (topicId) {
      resources = response.filter((item) => {
        return item?.resourceTopic?.id === parseInt(topicId);
      });
    }

    if (subtopicIds?.length) {
      resources = response.filter((item) => {
        const { resourceSubtopics } = item;

        const subtopicCheck = subtopicIds.some((id) => {
          return resourceSubtopics.some(
            (subtopic) => subtopic.id === parseInt(id)
          );
        });
        return subtopicCheck;
      });
    }

    return resources;
  } catch (error) {
    throw new Error(error);
  }
};

exports.handleGetResourceTopics = async () => {
  try {
    return await getResourceTopics();
  } catch (error) {
    throw new Error(error);
  }
};

exports.handleGetResourceSubtopics = async (topicId) => {
  try {
    return await getResourceSubtopics(topicId);
  } catch (error) {
    throw new Error(error);
  }
};
