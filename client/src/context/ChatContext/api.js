import axios from 'axios';

export const getThread = async ({ phoneNumber, limit, selectedMessageId }) => {
  try {
    const { data: messageData } = await axios.get('/api/messages/thread', {
      params: { phoneNumber, limit, selectedMessageId },
    });
    return messageData;
  } catch (error) {
    throw error;
  }
};

export const getMessageIndex = async ({ phoneNumber, selectedMessageId }) => {
  try {
    const { data: messageIndex } = await axios.get(`/api/messages/${selectedMessageId}/index`, {
      params: { phoneNumber },
    });
    return messageIndex;
  } catch (error) {
    throw error;
  }
};

export const getPatientThreads = async ({ limit, query }) => {
  try {
    const { data: threadData } = await axios.get('/api/patients/threads', {
      params: { limit, query },
    });
    return threadData;
  } catch (error) {
    throw error;
  }
};

export const updateReadMessage = async ({ patientId }) => {
  try {
    await axios.put('/api/messages/is-read', {
      patientId,
    });
  } catch (error) {
    throw error;
  }
};

export const getRecipient = async ({ phoneNumber }) => {
  try {
    const { data: recipient } = await axios.get('/api/patients/threads', {
      params: {
        phoneNumber,
      },
    });
    return recipient;
  } catch (error) {
    throw error;
  }
};

export const sendMessage = async ({ body, phoneNumber, auth0Id }) => {
  try {
    await axios.post('/api/messages/outbound', {
      body,
      phoneNumber,
      auth0Id,
    });
  } catch (error) {
    throw error;
  }
};

export const getMessages = async (params) => {
  try {
    const { data: messageData } = await axios.get('/api/messages', {
      params,
    });
    return messageData;
  } catch (error) {
    throw error;
  }
};
