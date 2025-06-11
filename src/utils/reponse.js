
const createReponse = (success, statusCode, message, data) => {
  return {
    success,
    statusCode: statusCode,
    message,
    data: data || null,
  };
};

export default createReponse;