const {
  getOptions,
  addOption,
  getIntakeFormOptions,
  getSignupFormOptions,
  getTransitionFormOptions,
} = require("../queries/crm");
const { getProviders } = require("../queries/user");
const { snakeCase } = require("change-case");
const _ = require("lodash");

exports.handleGetOptions = async (apiSlug, queryObj) => {
  try {
    const tableName = snakeCase(apiSlug);

    let options = [];

    let whereQuery = "";
    if (!_.isEmpty(queryObj)) {
      whereQuery = Object.entries(queryObj).reduce((totalString, query) => {
        return totalString + `${snakeCase(query[0])}=${query[1]}`;
      }, "WHERE ");
    }

    options = await getOptions(tableName, whereQuery);

    return options;
  } catch (error) {
    throw error;
  }
};

exports.handleAddNewOption = async ({ slug, option: label }) => {
  try {
    const tableName = snakeCase(slug);
    const result = await addOption(tableName, label);
    return result;
  } catch (error) {
    throw error;
  }
};

exports.handleGetFormOptions = async (formName, locale) => {
  try {
    let formOptions = [];
    if (formName === "sign-up") {
      formOptions = await getSignupFormOptions(locale);
    }

    if (formName === "intake") {
      formOptions = await getIntakeFormOptions(locale);
    }

    if (formName === "transition") {
      formOptions = await getTransitionFormOptions();
    }

    return formOptions;
  } catch (error) {
    console.log("Error @ handleGetFormOpions:", error);
    throw error;
  }
};
