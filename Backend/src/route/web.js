import express from "express";
import homeController from "../controllers/homeController";
import userController from "../controllers/userController";
import hotelController from "../controllers/hotelController";
import roomController from "../controllers/roomController";
import bookingController from "../controllers/bookingController";
import upload from "../middleware/upload";
import { verifyToken, requireAdmin } from "../middleware/auth";
import { validate, validationSchemas } from "../middleware/validation";

let router = express.Router();

let initWebRoute = (app) => {
    // Home (legacy EJS demo)
    router.get("/", homeController.getHomePage);
    router.get("/crud", homeController.getCRUD);
    router.post("/post-crud", homeController.postCRUD);
    router.get("/get-crud", homeController.displayCRUD);
    router.get("/edit-crud", homeController.getEditCRUD);
    router.post("/put-crud", homeController.putCRUD);
    router.get("/delete-crud", homeController.deleteCRUD);

    /*
    =========================
    PUBLIC API
    =========================
    */

    router.post("/api/login", validate(validationSchemas.login), userController.handleLogin);
    router.post("/api/register", validate(validationSchemas.register), userController.handleRegister);

    router.get("/api/get-all-hotels", hotelController.handleGetAllHotels);
    router.get("/api/get-hotels-by-city", validate(validationSchemas.getHotelsByCity), hotelController.handleGetHotelsByCity);
    router.get("/api/get-detail-hotel", validate(validationSchemas.getHotelDetail), hotelController.handleGetHotelDetail);
    router.get("/api/search-hotels", hotelController.handleSearchHotels);
    router.get("/api/get-rooms-by-hotel", validate(validationSchemas.getRoomsByHotel), roomController.handleGetRoomsByHotel);

    /*
    =========================
    AUTHENTICATED API (customer + admin)
    =========================
    */

    router.post("/api/create-booking", verifyToken, validate(validationSchemas.createBooking), bookingController.handleCreateBooking);
    router.get("/api/get-booking-by-user", verifyToken, validate(validationSchemas.getBookingByUser), bookingController.handleGetBookingByUser);
    router.put("/api/cancel-booking", verifyToken, validate(validationSchemas.cancelBooking), bookingController.handleCancelBooking);

    router.post("/api/create-review", verifyToken, validate(validationSchemas.createReview), hotelController.handleCreateReview);
    router.get("/api/get-review-by-hotel", validate(validationSchemas.getReviewByHotel), hotelController.handleGetReviewByHotel);

    /*
    =========================
    ADMIN API
    =========================
    */

    router.get("/api/admin/dashboard", verifyToken, requireAdmin, hotelController.handleAdminDashboard);

    router.post(
        "/api/create-hotel",
        verifyToken,
        requireAdmin,
        validate(validationSchemas.createHotel),
        upload.fields([
            { name: "thumbnail", maxCount: 1 },
            { name: "hotelImages", maxCount: 20 }
        ]),
        hotelController.handleCreateHotel
    );

    router.put(
        "/api/edit-hotel",
        verifyToken,
        requireAdmin,
        validate(validationSchemas.editHotel),
        upload.fields([
            { name: "thumbnail", maxCount: 1 },
            { name: "hotelImages", maxCount: 20 }
        ]),
        hotelController.handleEditHotel
    );

    router.delete("/api/delete-hotel", verifyToken, requireAdmin, validate(validationSchemas.deleteHotel), hotelController.handleDeleteHotel);
    router.post("/api/upload-hotel-image", verifyToken, requireAdmin, hotelController.handleUploadHotelImage);

    router.get("/api/admin/get-rooms-by-hotel", verifyToken, requireAdmin, validate(validationSchemas.getRoomsByHotel), roomController.handleAdminGetRoomsByHotel);
    router.post(
        "/api/create-room",
        verifyToken,
        requireAdmin,
        validate(validationSchemas.createRoom),
        upload.fields([
            { name: "roomImages", maxCount: 20 }
        ]),
        roomController.handleCreateRoom
    );

    router.put(
        "/api/edit-room",
        verifyToken,
        requireAdmin,
        validate(validationSchemas.editRoom),
        upload.fields([
            { name: "roomImages", maxCount: 20 }
        ]),
        roomController.handleEditRoom
    );
    router.delete("/api/delete-room", verifyToken, requireAdmin, validate(validationSchemas.deleteRoom), roomController.handleDeleteRoom);

    router.get("/api/get-all-bookings", verifyToken, requireAdmin, bookingController.handleGetAllBookings);
    router.put("/api/confirm-booking", verifyToken, requireAdmin, validate(validationSchemas.confirmBooking), bookingController.handleConfirmBooking);
    router.put("/api/admin-cancel-booking", verifyToken, requireAdmin, validate(validationSchemas.adminCancelBooking), bookingController.handleAdminCancelBooking);
    router.put("/api/checkin-booking", verifyToken, requireAdmin, validate(validationSchemas.checkinBooking), bookingController.handleCheckinBooking);
    router.put("/api/checkout-booking", verifyToken, requireAdmin, validate(validationSchemas.checkoutBooking), bookingController.handleCheckoutBooking);

    router.get("/api/get-all-users", verifyToken, requireAdmin, userController.handleGetAllUsers);
    router.post("/api/create-new-user", verifyToken, requireAdmin, validate(validationSchemas.createUser), userController.handleCreateNewUser);
    router.put("/api/edit-user", verifyToken, requireAdmin, validate(validationSchemas.editUser), userController.handleEditUser);
    router.delete("/api/delete-user", verifyToken, requireAdmin, validate(validationSchemas.deleteUser), userController.handleDeleteUser);

    return app.use("/", router);
};

module.exports = initWebRoute;
