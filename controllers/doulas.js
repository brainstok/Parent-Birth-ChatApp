const { getDoulas } = require("../services/cms");
const camelcaseKeys = require("camelcase-keys");

exports.handleGetDoulas = async (query) => {
  try {
    let queryString = "populate=*";

    if (query?.city?.length > 0) {
      queryString += `&filters[$and][0][city][[$contains]=${query.city}`;
    }

    if (query.page) {
      queryString += `&pagination[page]=${query.page}&pagination[pageSize]=10&pagination[withCount]=true`;
    }

    queryString += `&sort=firstName:ASC`;

    const doulasData = await getDoulas(queryString);

    const doulas = doulasData.data.map((doula) => {
      return camelcaseKeys(doula, { deep: true });
    });

    const newDoulas = {
      doulas: doulas,
      pagination: doulasData.meta.pagination,
    };

    return newDoulas;
  } catch (error) {
    throw new Error(error);
  }
};
