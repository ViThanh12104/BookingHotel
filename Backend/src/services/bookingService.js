import db from "../models/index";
import Sequelize from "sequelize";

import sendBookingEmail from "../utils/sendMail";

let createBooking = (data, io = null) => {
    return new Promise(async (resolve, reject) => {
        const t = await db.sequelize.transaction();

        try {
            const { user_id, room_id, check_in, check_out } = data;

            // 1. Validate
            if (!user_id || !room_id || !check_in || !check_out) {
                await t.rollback();
                return resolve({
                    errCode: 1,
                    errMessage: "Missing input"
                });
            }

            const start = new Date(check_in);
            const end = new Date(check_out);

            if (end <= start) {
                await t.rollback();
                return resolve({
                    errCode: 2,
                    errMessage: "Invalid date"
                });
            }

            // 2. Lấy room
            const room = await db.rooms.findOne({
                where: { id: room_id },
                transaction: t
            });

            if (!room) {
                await t.rollback();
                return resolve({
                    errCode: 3,
                    errMessage: "Room not found"
                });
            }

            // CHECK SỐ LƯỢNG
            if (room.available_count <= 0) {
                await t.rollback();
                return resolve({
                    errCode: 4,
                    errMessage: "Room hết!"
                });
            }

            // 3. Tính tiền
            const nights =
                (end - start) / (1000 * 60 * 60 * 24);

            const total_price = nights * room.price;

            // 4. Tạo booking
            const booking = await db.bookings.create({
                user_id,
                room_id,
                check_in,
                check_out,
                total_price,
                status: "pending"
            }, { transaction: t });

            // TRỪ SỐ LƯỢNG
            await db.rooms.update(
                {
                    available_count: room.available_count - 1
                },
                {
                    where: { id: room_id },
                    transaction: t
                }
            );

            await t.commit();

            if (io) {
                io.emit("bookingCreated", {
                    bookingId: booking.id,
                    userId: user_id,
                    roomId: room_id,
                    status: "pending",
                    availableCount: room.available_count - 1
                });
                io.emit("roomAvailabilityUpdated", {
                    roomId: room_id,
                    availableCount: room.available_count - 1
                });
            }

            resolve({
                errCode: 0,
                errMessage: "Create booking success!",
                booking
            });

        } catch (e) {

            console.log(e);

            if (t && !t.finished) {
                await t.rollback();
            }

            reject(e);
        }
    });
};

/*
========================================
Lấy booking theo user
========================================
*/
let getBookingByUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {

            let data = await db.bookings.findAll({
                where: {
                    user_id: userId
                },
                include: [
                    {
                        model: db.rooms,
                        as: "bookingRoom",
                        include: [
                            {
                                model: db.room_images,
                                as: "roomImages",
                                limit: 1
                            }
                        ]
                    }
                    ,
                    {
                        model: db.reviews,
                        as: "bookingReview"
                    }
                ],
                raw: false,
                nest: true
            });

            // update status theo thời gian
            let now = new Date();

            data = data.map(item => {

                let checkOut = new Date(item.check_out);

                // nếu quá hạn và chưa huỷ
                if (
                    checkOut < now &&
                    item.status !== "cancelled"
                ) {
                    item.status = "completed";
                }

                return item;
            });

            resolve(data);

        } catch (e) {
            reject(e);
        }
    });
};


let cancelBooking = (bookingId, userId, io = null) => {
    return new Promise(async (resolve, reject) => {
        const t = await db.sequelize.transaction();

        try {
            // 🔎 tìm booking (KHÔNG raw)
            let booking = await db.bookings.findOne({
                where: { id: bookingId },
                transaction: t
            });

            if (!booking) {
                await t.rollback();
                return resolve({
                    errCode: 1,
                    errMessage: "Booking not found!"
                });
            }

            // 🔒 check quyền
            if (booking.user_id !== userId) {
                await t.rollback();
                return resolve({
                    errCode: 2,
                    errMessage: "No permission"
                });
            }

            // 🚫 đã huỷ rồi
            if (booking.status === "cancelled") {
                await t.rollback();
                return resolve({
                    errCode: 3,
                    errMessage: "Already cancelled"
                });
            }

            // ⏰ check thời gian
            if (new Date(booking.check_in) <= new Date()) {
                await t.rollback();
                return resolve({
                    errCode: 4,
                    errMessage: "Cannot cancel after check-in"
                });
            }

            // 🛏️ lấy room
            let room = await db.rooms.findOne({
                where: { id: booking.room_id },
                transaction: t
            });

            if (!room) {
                await t.rollback();
                return resolve({
                    errCode: 5,
                    errMessage: "Room not found"
                });
            }

            // ✅ update booking (CÁCH AN TOÀN)
            await db.bookings.update(
                { status: "cancelled" },
                {
                    where: { id: bookingId },
                    transaction: t
                }
            );

            // ✅ cộng lại số phòng
            await db.rooms.update(
                {
                    available_count: room.available_count + 1
                },
                {
                    where: { id: booking.room_id },
                    transaction: t
                }
            );

            await t.commit();

            if (io) {
                io.emit("bookingUpdated", {
                    bookingId,
                    userId: booking.user_id,
                    roomId: booking.room_id,
                    status: "cancelled"
                });
                io.emit("roomAvailabilityUpdated", {
                    roomId: booking.room_id,
                    availableCount: room.available_count + 1
                });
            }

            return resolve({
                errCode: 0,
                errMessage: "Cancel booking success!"
            });

        } catch (e) {
            await t.rollback();
            return reject(e);
        }
    });
};

let adminCancelBooking = (bookingId, io = null) => {
    return new Promise(async (resolve, reject) => {
        const t = await db.sequelize.transaction();

        try {
            let booking = await db.bookings.findOne({
                where: { id: bookingId },
                transaction: t
            });

            if (!booking) {
                await t.rollback();
                return resolve({
                    errCode: 1,
                    errMessage: "Booking not found!"
                });
            }

            if (booking.status === "cancelled") {
                await t.rollback();
                return resolve({
                    errCode: 2,
                    errMessage: "Booking already cancelled"
                });
            }

            let room = await db.rooms.findOne({
                where: { id: booking.room_id },
                transaction: t
            });

            if (!room) {
                await t.rollback();
                return resolve({
                    errCode: 3,
                    errMessage: "Room not found"
                });
            }

            await db.bookings.update(
                { status: "cancelled" },
                {
                    where: { id: bookingId },
                    transaction: t
                }
            );

            await db.rooms.update(
                {
                    available_count: room.available_count + 1
                },
                {
                    where: { id: booking.room_id },
                    transaction: t
                }
            );

            await t.commit();

            if (io) {
                io.emit("bookingUpdated", {
                    bookingId,
                    userId: booking.user_id,
                    roomId: booking.room_id,
                    status: "cancelled"
                });
                io.emit("roomAvailabilityUpdated", {
                    roomId: booking.room_id,
                    availableCount: room.available_count + 1
                });
            }

            return resolve({
                errCode: 0,
                errMessage: "Admin cancel booking success!"
            });

        } catch (e) {
            await t.rollback();
            return reject(e);
        }
    });
};

let checkoutBooking = (bookingId, io = null) => {
    return new Promise(async (resolve, reject) => {
        const t = await db.sequelize.transaction();

        try {
            let booking = await db.bookings.findOne({
                where: {
                    id: bookingId
                },
                raw: false,
                transaction: t
            });

            if (!booking) {
                await t.rollback();
                return resolve({
                    errCode: 1,
                    errMessage: "Booking not found!"
                });
            }

            if (booking.status === "cancelled" || booking.status === "completed") {
                await t.rollback();
                return resolve({
                    errCode: 2,
                    errMessage: "Booking cannot be checked out"
                });
            }

            let room = await db.rooms.findOne({
                where: {
                    id: booking.room_id
                },
                transaction: t
            });

            if (!room) {
                await t.rollback();
                return resolve({
                    errCode: 3,
                    errMessage: "Room not found"
                });
            }

            booking.status = "completed";
            await booking.save({ transaction: t });

            await db.rooms.update(
                {
                    available_count: room.available_count + 1
                },
                {
                    where: {
                        id: booking.room_id
                    },
                    transaction: t
                }
            );

            await t.commit();

            if (io) {
                io.emit("bookingUpdated", {
                    bookingId,
                    userId: booking.user_id,
                    status: "completed"
                });
                io.emit("roomAvailabilityUpdated", {
                    roomId: booking.room_id,
                    availableCount: room.available_count + 1
                });
            }

            resolve({
                errCode: 0,
                errMessage: "Checkout success!"
            });

        } catch (e) {
            if (t && !t.finished) {
                await t.rollback();
            }
            reject(e);
        }
    });
};
let checkinBooking = (bookingId, io = null) => {
    return new Promise(async (resolve, reject) => {

        try {

            let booking = await db.bookings.findOne({
                where: {
                    id: bookingId
                },
                raw: false
            });

            if (!booking) {

                return resolve({
                    errCode: 1,
                    errMessage: "Booking not found!"
                });
            }

            // chỉ checkin khi đã xác nhận
            if (booking.status !== "confirmed") {

                return resolve({
                    errCode: 2,
                    errMessage:
                        "Booking is not confirmed!"
                });
            }

            booking.status = "checked_in";

            await booking.save();

            if (io) {
                io.emit("bookingUpdated", {
                    bookingId,
                    userId: booking.user_id,
                    status: "checked_in"
                });
            }

            resolve({
                errCode: 0,
                errMessage: "Checkin success!"
            });

        } catch (e) {
            reject(e);
        }
    });
};


let getAllBookings = () => {
    return new Promise(async (resolve, reject) => {

        try {

            let data = await db.bookings.findAll({

                include: [

                    {
                        model: db.rooms,
                        as: "bookingRoom",

                        include: [
                            {
                                model: db.room_images,
                                as: "roomImages"
                            }
                        ]
                    },

                    {
                        model: db.users,
                        as: "bookingUser",

                        attributes: [
                            "id",
                            "name",
                            "email"
                        ]
                    }

                ],

                raw: false,
                nest: true
            });

            resolve(data);

        } catch (e) {
            reject(e);
        }
    });
};
let confirmBooking = (bookingId, io = null) => {
    return new Promise(async (resolve, reject) => {

        try {

            let booking = await db.bookings.findOne({

                where: {
                    id: bookingId
                },

                include: [

                    {
                        model: db.users,
                        as: "bookingUser"
                    },

                    {
                        model: db.rooms,
                        as: "bookingRoom"
                    }

                ],

                raw: false,
                nest: true
            });

            if (!booking) {

                return resolve({
                    errCode: 1,
                    errMessage: "Booking not found!"
                });
            }

            // update status
            booking.status = "confirmed";

            await booking.save();

            // lấy hotel
            let hotel = await db.hotels.findOne({
                where: {
                    id: booking.bookingRoom.hotel_id
                }
            });

            // gửi mail xác nhận
            await sendBookingEmail(
                booking.bookingUser.email,
                {
                    userName:
                        booking.bookingUser.name,

                    roomName:
                        booking.bookingRoom.room_type,

                    check_in:
                        booking.check_in,

                    check_out:
                        booking.check_out,

                    total_price:
                        booking.total_price,

                    HOTEL_NAME:
                        hotel.name
                }
            );

            if (io) {
                io.emit("bookingUpdated", {
                    bookingId,
                    userId: booking.user_id,
                    status: "confirmed"
                });
            }

            resolve({
                errCode: 0,
                errMessage: "Confirm booking success!"
            });

        } catch (e) {
            reject(e);
        }
    });
};


module.exports = {

    createBooking,
    getBookingByUser,
    cancelBooking,
    checkoutBooking,
    checkinBooking,
    getAllBookings,
    confirmBooking,
    adminCancelBooking

};