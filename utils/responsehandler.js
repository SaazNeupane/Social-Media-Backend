module.exports = async (
  status,
  message,
  statusCode,
  resType,
  data = {},
  res
) => {
  return await res.status(statusCode).json({
    status,
    message,
    statusCode,
    resType,
    data,
  });
};
