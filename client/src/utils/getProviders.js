import axios from 'axios';

const getProviders = async () => {
  try {
    const { data: options } = await axios.get(`/api/users/providers`);
    return options;
  } catch (error) {
    return error;
  }
};

export default getProviders;
