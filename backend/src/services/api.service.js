import axios from "axios";

export const sendApiRequest = async ({ method, url, headers, body }) => {
  try {
    const response = await axios({
      method,
      url,
      headers,
      data: body,
    });

    return {
      status: response.status,
      data: response.data,
      headers: response.headers,
    };
  } catch (error) {
    return {
      error: true,
      message: error.message,
      status: error.response?.status || 500,
      data: error.response?.data || null,
    };
  }
};