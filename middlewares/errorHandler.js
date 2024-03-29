const errorHandler = (err, req, res, next) => {
  console.log(err, "ERROR-------");
  console.log("Error Handler Middleware run!");
  const errorCode = err.statusCode || 500;
  const errMessage = err.message || "Internal server error!";
  res.status(errorCode).json({
    status: errorCode,
    message: errMessage,
    data: [],
    stack: err.stack,
  });
};

module.exports = errorHandler;
