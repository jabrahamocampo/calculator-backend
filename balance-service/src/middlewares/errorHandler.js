import ApiError from "../errors/ApiError.js";

export default function errorHandler(err, req, res, next) {

    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            status: "error",
            message: err.message,
            details: err.details || null
        });
    }

    //System Error
    return res.status(500).json({
        status: "error",
        message: "Internal Server Error"
    });
}