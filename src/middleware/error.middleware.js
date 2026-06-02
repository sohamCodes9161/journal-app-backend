import multer from "multer";

const errorMiddleware = (err, req, res, next) => {
  // Handle multer-specific errors with clean user-facing messages
  if (err instanceof multer.MulterError) {
    const message =
      err.code === "LIMIT_FILE_SIZE"
        ? "File too large. Maximum allowed size is 10MB."
        : "File upload error.";

    return res.status(400).json({
      success: false,
      message,
      errors: [],
    });
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  return res.status(statusCode).json({
    success: false,
    message,
    errors: err.errors || [],
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};

export default errorMiddleware;
