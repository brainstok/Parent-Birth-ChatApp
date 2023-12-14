const {
  createUser,
  updateUser,
  getUser,
  deleteUser,
  getProviderViaAuth0Id,
  getProviders,
  updateProviderNoteTag,
  getDoulas,
} = require("../queries/user");

module.exports.handleGetProvider = async ({ auth0Id }) => {
  try {
    const provider = await getProviderViaAuth0Id(auth0Id);
    return provider;
  } catch (error) {
    console.log("error", error.message);
    throw new Error(error);
  }
};

module.exports.handleCreateUser = async (newUserInfo) => {
  try {
    const newUser = await createUser(newUserInfo);
    return newUser;
  } catch (error) {
    throw new Error(error);
  }
};

module.exports.handleUpdateUser = async (user) => {
  try {
    const updatedUser = await updateUser(user);
    if (updatedUser) {
      return updatedUser;
    } else {
      throw new Error("User not found");
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports.handleGetUser = async (query) => {
  try {
    const user = await getUser(query);
    return user;
  } catch (error) {
    throw new Error(error);
  }
};

module.exports.handleGetProviders = async () => {
  try {
    let providers = [];

    if (process.env.ENVIRONMENT === "staging") {
      providers = await getProviders();
    } else {
      providers = await getDoulas();
    }

    return providers;
  } catch (error) {
    throw new Error(error);
  }
};

module.exports.handleDeleteUser = async (userId) => {
  try {
    await deleteUser({ _id: userId });
  } catch (error) {
    throw new Error(error);
  }
};

module.exports.handleUpdateProviderNoteTag = async (values) => {
  try {
    return await updateProviderNoteTag(values);
  } catch (error) {
    throw new Error(error);
  }
};
