class ApiError extends Error {
    constructor(statusCode, message, details = null) {
        super(message);
        this.statusCode = statusCode;
        this.details = details;
        Error.captureStackTrace(this, this.constructor);
    }

    static badRequest(msg, details) {
        return new ApiError(400, msg, details);
    }

    static notFound(msg, details) {
        return new ApiError(404, msg, details);
    }

    static internal(msg = "Internal Server Error", details) {
        return new ApiError(500, msg, details);
    }
}

export default ApiError;
