/**
 * Custom Error Classes
 * Hierarchy: AppError (base) -> SpecificError
 */

class AppError extends Error {
    constructor(message, statusCode, errCode) {
        super(message);
        this.statusCode = statusCode;
        this.errCode = errCode;
        this.timestamp = new Date().toISOString();

        Error.captureStackTrace(this, this.constructor);
    }
}

// 400 - Bad Request / Validation errors
class ValidationError extends AppError {
    constructor(message, errors = []) {
        super(message, 400, 400);
        this.errors = errors;
    }
}

// 400 - Bad Request
class BadRequestError extends AppError {
    constructor(message) {
        super(message, 400, 400);
    }
}

// 401 - Unauthorized
class UnauthorizedError extends AppError {
    constructor(message = "Unauthorized: invalid or expired token") {
        super(message, 401, 401);
    }
}

// 403 - Forbidden
class ForbiddenError extends AppError {
    constructor(message = "Forbidden: access denied") {
        super(message, 403, 403);
    }
}

// 404 - Not Found
class NotFoundError extends AppError {
    constructor(resource = "Resource") {
        super(`${resource} not found`, 404, 404);
    }
}

// 409 - Conflict (e.g., duplicate email)
class ConflictError extends AppError {
    constructor(message) {
        super(message, 409, 409);
    }
}

// 500 - Internal Server Error
class InternalServerError extends AppError {
    constructor(message = "Internal Server Error") {
        super(message, 500, 500);
    }
}

// 422 - Unprocessable Entity
class UnprocessableEntityError extends AppError {
    constructor(message, details = {}) {
        super(message, 422, 422);
        this.details = details;
    }
}

export {
    AppError,
    ValidationError,
    BadRequestError,
    UnauthorizedError,
    ForbiddenError,
    NotFoundError,
    ConflictError,
    InternalServerError,
    UnprocessableEntityError
};
