/**
 * Global Error Handling Middleware
 * Catches and logs all errors, returns consistent response format
 */

import {
    AppError,
    ValidationError,
    InternalServerError
} from "../utils/errors";

/**
 * Main error handling middleware
 * Must be placed AFTER all routes and middlewares
 */
const errorHandler = (err, req, res, next) => {
    // Log error details
    logError(err, req);

    // If error is not an instance of AppError, convert it
    let error = err;
    if (!(error instanceof AppError)) {
        error = new InternalServerError(
            process.env.NODE_ENV === 'production'
                ? 'An unexpected error occurred'
                : err.message
        );
    }

    // Build error response
    const errorResponse = buildErrorResponse(error);

    // Send response
    return res.status(error.statusCode).json(errorResponse);
};

/**
 * Build consistent error response format
 */
const buildErrorResponse = (error) => {
    const response = {
        errCode: error.errCode || 500,
        errMessage: error.message,
        timestamp: error.timestamp
    };

    // Add validation errors if present
    if (error.errors && error.errors.length > 0) {
        response.errors = error.errors;
    }

    // Add details for unprocessable entity
    if (error.details) {
        response.details = error.details;
    }

    // Add stack trace in development
    if (process.env.NODE_ENV === 'development') {
        response.stack = error.stack;
    }

    return response;
};

/**
 * Log error details
 */
const logError = (err, req) => {
    const timestamp = new Date().toISOString();
    const method = req.method;
    const url = req.originalUrl;
    const userAgent = req.get('user-agent');
    const ip = req.ip || req.connection.remoteAddress;

    const errorLog = {
        timestamp,
        method,
        url,
        status: err.statusCode || 500,
        message: err.message,
        userAgent,
        ip,
        body: method !== 'GET' ? req.body : null,
        query: req.query,
        stack: err.stack
    };

    // Log to console (in production, use logging service like Winston)
    if (process.env.NODE_ENV === 'development') {
        console.error('❌ ERROR:', JSON.stringify(errorLog, null, 2));
    } else {
        console.error('❌ ERROR:', {
            timestamp,
            method,
            url,
            status: err.statusCode || 500,
            message: err.message
        });
    }
};

/**
 * 404 handler - must be placed after all routes
 */
const notFoundHandler = (req, res, next) => {
    const error = new AppError(
        `Route ${req.originalUrl} not found`,
        404,
        404
    );
    next(error);
};

/**
 * Async wrapper to catch errors in async functions
 * Usage: router.post('/route', asyncHandler(async (req, res) => { ... }))
 */
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

export {
    errorHandler,
    notFoundHandler,
    asyncHandler,
    buildErrorResponse,
    logError
};
