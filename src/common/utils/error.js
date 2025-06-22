const createError = (statusCode, message) => {
    const error = new Error(message || "INTERNAL SERVER ERROR");
    error.statusCode = statusCode || 500;
    return error;
}
export default createError;