const { snakeCase } = require("change-case");

const createColumnPairsArrayFromObject = (object) => {
  return Object.entries(object).map((keyValuePair) => [
    snakeCase(keyValuePair[0]),
    keyValuePair[1],
  ]);
};

module.exports = createColumnPairsArrayFromObject;
