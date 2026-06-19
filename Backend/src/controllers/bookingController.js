import bookingService from "../services/bookingService";
import { asyncHandler } from "../middleware/errorHandler";
import { BadRequestError, ForbiddenError, NotFoundError } from "../utils/errors";


let handleCreateBooking = asyncHandler(async (req, res) => {
    let data = {
        ...req.body,
        user_id: req.user.id
    };

    let message = await bookingService.createBooking(data, req.app.locals.io);

    if (message.errCode !== 0) {
        throw new BadRequestError(message.errMessage);
    }

    return res.status(201).json({
        errCode: 0,
        errMessage: message.errMessage,
        booking: message.booking
    });
});

let handleGetBookingByUser = asyncHandler(async (req, res) => {
    let userId = req.query.userId;
    const role = (req.user?.role || "").toLowerCase();

    if (role !== "admin" && Number(userId) !== Number(req.user.id)) {
        throw new ForbiddenError("You can only view your own bookings");
    }

    let bookings = await bookingService.getBookingByUser(userId);

    return res.status(200).json({
        errCode: 0,
        errMessage: "OK",
        bookings: bookings
    });
});

/*
========================================
Hủy booking
API: PUT /api/cancel-booking
body:
{
    id,
    userId
}
========================================
*/
let handleCancelBooking = asyncHandler(async (req, res) => {
    let { id, userId } = req.body;
    const role = (req.user?.role || "").toLowerCase();

    if (role !== "admin" && Number(userId) !== Number(req.user.id)) {
        throw new ForbiddenError("You can only cancel your own bookings");
    }

    let message = await bookingService.cancelBooking(id, userId, req.app.locals.io);

    if (message.errCode !== 0) {
        throw new NotFoundError("Booking");
    }

    return res.status(200).json({
        errCode: 0,
        errMessage: message.errMessage
    });
});

let handleGetAllBookings = asyncHandler(async (req, res) => {
    let bookings = await bookingService.getAllBookings();

    return res.status(200).json({
        errCode: 0,
        errMessage: "OK",
        bookings: bookings
    });
});

let handleConfirmBooking = asyncHandler(async (req, res) => {
    let { id } = req.body;

    let message = await bookingService.confirmBooking(id, req.app.locals.io);

    if (message.errCode !== 0) {
        throw new BadRequestError(message.errMessage);
    }

    return res.status(200).json({
        errCode: 0,
        errMessage: message.errMessage
    });
});

let handleAdminCancelBooking = asyncHandler(async (req, res) => {
    let { id } = req.body;

    let message = await bookingService.adminCancelBooking(id, req.app.locals.io);

    if (message.errCode !== 0) {
        throw new NotFoundError("Booking");
    }

    return res.status(200).json({
        errCode: 0,
        errMessage: message.errMessage
    });
});

let handleCheckinBooking = asyncHandler(async (req, res) => {
    let { id } = req.body;

    let message = await bookingService.checkinBooking(id, req.app.locals.io);

    if (message.errCode !== 0) {
        throw new BadRequestError(message.errMessage);
    }

    return res.status(200).json({
        errCode: 0,
        errMessage: message.errMessage
    });
});

let handleCheckoutBooking = asyncHandler(async (req, res) => {
    let { id } = req.body;

    let message = await bookingService.checkoutBooking(id, req.app.locals.io);

    if (message.errCode !== 0) {
        throw new BadRequestError(message.errMessage);
    }

    return res.status(200).json({
        errCode: 0,
        errMessage: message.errMessage
    });
});

export default {
    handleCreateBooking,
    handleGetBookingByUser,
    handleCancelBooking,
    handleGetAllBookings,
    handleConfirmBooking,
    handleAdminCancelBooking,
    handleCheckinBooking,
    handleCheckoutBooking
};