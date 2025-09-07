import ApiError from "../errors/ApiError.js";

export default function errorHandler(err, req, res, next) {
  console.error('[ERROR HANDLER]', err && (err.stack || err));

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      status: "error",
      message: err.message,
      details: err.details || null
    });
  }

  // Send stacktrace on dev to debug faster
  const isProd = process.env.NODE_ENV === 'production';
  return res.status(500).json({
    status: "error",
    message: isProd ? "Internal Server Error" : (err.message || "Internal Server Error"),
    ...(isProd ? {} : { stack: err.stack })
  });
}
