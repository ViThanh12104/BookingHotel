import axios from "axios";
import db from "../models/index";
import Sequelize from "sequelize";

const Op = Sequelize.Op;
/*
========================================
Lấy tất cả khách sạn
========================================
*/
let getAllHotels = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.hotels.findAll({
                attributes: [
                    "id",
                    "name",
                    "city",
                    "address",
                    "description",
                    "rating",
                    "thumbnail"
                ],
                include: [
                    {
                        model: db.hotels_images,
                        as: "hotelImages",
                        attributes: [
                            "id",
                            "image_url"
                        ]
                    },

                    {
                        model: db.rooms,
                        as: "rooms",
                        attributes: [
                            "id",
                            "room_type",
                            "price",
                            "bed_info",
                            "size",
                            "free_cancel",
                            "breakfast_included",
                            "pay_at_hotel",
                            "available_count",

                        ],
                        separate: true,
                        limit: 1,
                        order: [["price", "ASC"]]
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

/*
========================================
Lấy chi tiết khách sạn theo id
========================================
*/
let getHotelDetail = (hotelId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.hotels.findOne({
                where: { id: hotelId },

                attributes: [
                    "id",
                    "name",
                    "city",
                    "address",
                    "description",
                    "rating",
                    "thumbnail"
                ],

                include: [
                    // 🔹 Ảnh khách sạn
                    {
                        model: db.hotels_images,
                        as: "hotelImages",
                        attributes: ["id", "image_url"]
                    },

                    // 🔹 Danh sách phòng + ẢNH PHÒNG
                    {
                        model: db.rooms,
                        as: "rooms",
                        attributes: [
                            "id",
                            "room_type",
                            "price",
                            "bed_info",
                            "size",
                            "free_cancel",
                            "breakfast_included",
                            "pay_at_hotel",
                            "available_count"
                        ],

                        include: [
                            {
                                model: db.room_images,
                                as: "roomImages",
                                attributes: ["id", "image_url"]
                            }
                        ],

                        order: [["price", "ASC"]]
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

/*
========================================
Lấy khách sạn theo thành phố
========================================
*/
let getHotelsByCity = (city) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.hotels.findAll({
                where: {
                    city: {
                        [Op.like]: `%${city}%`
                    }
                },

                attributes: [
                    "id",
                    "name",
                    "city",
                    "address",
                    "description",
                    "rating",
                    "thumbnail"
                ],

                include: [
                    {
                        // gallery ảnh khách sạn
                        model: db.hotels_images,
                        as: "hotelImages",
                        attributes: [
                            "id",
                            "image_url"
                        ]
                    },

                    {
                        // lấy phòng giá thấp nhất
                        model: db.rooms,
                        as: "rooms",
                        attributes: [
                            "id",
                            "room_type",
                            "price",
                            "bed_info",
                            "size",
                            "free_cancel",
                            "breakfast_included",
                            "pay_at_hotel",
                            "available_count",

                        ],
                        separate: true,
                        limit: 1,
                        order: [["price", "ASC"]]
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

/*
========================================
Tìm kiếm khách sạn theo keyword
========================================
*/
let searchHotels = (keyword) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.hotels.findAll({
                where: {
                    [Op.or]: [
                        {
                            name: {
                                [Op.like]: `%${keyword}%`
                            }
                        },
                        {
                            city: {
                                [Op.like]: `%${keyword}%`
                            }
                        },
                        {
                            address: {
                                [Op.like]: `%${keyword}%`
                            }
                        }
                    ]
                },

                attributes: [
                    "id",
                    "name",
                    "city",
                    "address",
                    "description",
                    "rating",
                    "thumbnail"
                ],

                include: [
                    {
                        model: db.hotels_images,
                        as: "hotelImages",
                        attributes: ["id", "image_url"]
                    },
                    {
                        model: db.rooms,
                        as: "rooms",
                        attributes: [
                            "id",
                            "room_type",
                            "price",
                            "bed_info",
                            "size",
                            "free_cancel",
                            "breakfast_included",
                            "pay_at_hotel",
                            "available_count"
                        ],
                        separate: true,
                        limit: 1,
                        order: [["price", "ASC"]]
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

/*
========================================
Tạo booking đặt phòng
========================================
*/




/*
========================================
Hủy booking
========================================


/*
========================================
Tạo review khách sạn
========================================
*/
let createReview = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let existingReview = await db.reviews.findOne({
                where: {
                    booking_id: data.booking_id
                }
            });

            if (existingReview) {
                return resolve({
                    errCode: 2,
                    errMessage: "Booking này đã được đánh giá rồi"
                });
            }

            let booking = await db.bookings.findOne({
                where: {
                    id: data.booking_id,
                    user_id: data.user_id,
                    status: "completed"
                }
            });

            if (!booking) {
                return resolve({
                    errCode: 3,
                    errMessage: "Chỉ có thể đánh giá sau khi booking đã hoàn thành"
                });
            }

            await db.reviews.create({
                user_id: data.user_id,
                hotel_id: data.hotel_id,
                booking_id: data.booking_id,
                comment: data.comment,
                rating: data.rating
            });

            let result = await db.reviews.findAll({
                where: { hotel_id: data.hotel_id },
                attributes: [[Sequelize.fn('AVG', Sequelize.col('rating')), 'avgRating']],
                raw: true
            });

            let avgRating = result?.[0]?.avgRating ? parseFloat(result[0].avgRating) : 0;

            await db.hotels.update(
                { rating: avgRating },
                { where: { id: data.hotel_id } }
            );

            resolve({
                errCode: 0,
                errMessage: "Create review success!"
            });

        } catch (e) {
            reject(e);
        }
    });
};

/*
========================================
Lấy review theo khách sạn
========================================
*/
let getReviewByHotel = (hotelId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.reviews.findAll({
                where: {
                    hotel_id: hotelId
                },
                include: [
                    {
                        model: db.users,
                        as: "reviewUser",
                        attributes: [
                            "id",
                            "name"
                        ]
                    }
                ],
                raw: false,
                nest: true
            });

            let processed = data.map(review => ({
                id: review.id,
                hotel_id: review.hotel_id,
                booking_id: review.booking_id,
                user_id: review.user_id,
                userName: review.reviewUser?.name || "",
                comment: review.comment,
                rating: review.rating,
                createdAt: review.createdAt
            }));

            resolve(processed);

        } catch (e) {
            reject(e);
        }
    });
};

/*
========================================
Lấy phòng theo hotel
========================================
*/




let createHotel = (data) => {

    return new Promise(async (resolve, reject) => {

        try {

            // CREATE HOTEL

            let hotel = await db.hotels.create({

                name: data.name,

                city: data.city,

                address: data.address,

                description: data.description,

                rating: data.rating,

                thumbnail: data.thumbnail
            });

            // CREATE HOTEL IMAGES

            if (
                data.images &&
                data.images.length > 0
            ) {

                for (
                    let i = 0;
                    i < data.images.length;
                    i++
                ) {

                    await db.hotels_images.create({

                        hotel_id: hotel.id,

                        image_url: data.images[i]
                    });
                }
            }

            resolve({

                errCode: 0,

                errMessage: "Create hotel success!"
            });

        } catch (e) {

            console.log(e);

            reject(e);
        }
    });
};

let deleteHotel = (hotelId) => {
    return new Promise(async (resolve, reject) => {

        try {

            await db.hotels.destroy({
                where: {
                    id: hotelId
                }
            });

            resolve({
                errCode: 0,
                errMessage: "Delete hotel success!"
            });

        } catch (e) {
            reject(e);
        }
    });
};


let adminDashboard = () => {

    return new Promise(async (resolve, reject) => {

        try {

            // total users
            let totalUsers =
                await db.users.count();

            // total hotels
            let totalHotels =
                await db.hotels.count();

            // total bookings
            let totalBookings =
                await db.bookings.count();

            // total revenue
            let totalRevenueRaw =
                await db.bookings.sum(
                    "total_price",
                    {
                        where: {
                            status: "completed"
                        }
                    }
                );

            let totalRevenue = parseFloat(totalRevenueRaw) || 0;

            // total completed bookings
            let totalCompletedBookings =
                await db.bookings.count({
                    where: {
                        status: "completed"
                    }
                });

            // booking status counts
            let bookingStatusRows =
                await db.bookings.findAll({
                    attributes: [
                        "status",
                        [Sequelize.fn("COUNT", Sequelize.col("status")), "count"]
                    ],
                    group: ["status"],
                    raw: true
                });

            let bookingStatusCounts = {
                pending: 0,
                confirmed: 0,
                checked_in: 0,
                completed: 0,
                cancelled: 0
            };

            bookingStatusRows.forEach(row => {
                if (row.status && bookingStatusCounts.hasOwnProperty(row.status)) {
                    bookingStatusCounts[row.status] = parseInt(row.count, 10) || 0;
                }
            });

            // monthly revenue for the past 6 months
            let completedBookings =
                await db.bookings.findAll({
                    attributes: ["total_price", "createdAt"],
                    where: {
                        status: "completed"
                    },
                    raw: true
                });

            let revenueByMonth = {};

            completedBookings.forEach(booking => {
                let createdAt = booking.createdAt;
                let date = createdAt ? new Date(createdAt) : null;

                if (date && !Number.isNaN(date.getTime())) {
                    let monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
                    let revenueValue = parseFloat(booking.total_price) || 0;
                    revenueByMonth[monthKey] = (revenueByMonth[monthKey] || 0) + revenueValue;
                }
            });

            let revenueByMonthDay = {};

            completedBookings.forEach(booking => {
                let createdAt = booking.createdAt;
                let date = createdAt ? new Date(createdAt) : null;

                if (date && !Number.isNaN(date.getTime())) {
                    let monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
                    let dayKey = String(date.getDate()).padStart(2, "0");
                    let dayMapKey = `${monthKey}-${dayKey}`;
                    let revenueValue = parseFloat(booking.total_price) || 0;

                    revenueByMonthDay[dayMapKey] = (revenueByMonthDay[dayMapKey] || 0) + revenueValue;
                }
            });

            let monthlyRevenue = [];
            let dailyRevenueByMonth = {};
            let currentDate = new Date();

            for (let i = 5; i >= 0; i--) {
                let monthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
                let year = monthDate.getFullYear();
                let monthIndex = monthDate.getMonth();
                let monthKey = `${year}-${String(monthIndex + 1).padStart(2, "0")}`;
                let daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
                let dailyRevenue = [];

                for (let day = 1; day <= daysInMonth; day++) {
                    let dayKey = String(day).padStart(2, "0");
                    let dayMapKey = `${monthKey}-${dayKey}`;
                    dailyRevenue.push({
                        day: String(day),
                        revenue: revenueByMonthDay[dayMapKey] || 0
                    });
                }

                dailyRevenueByMonth[monthKey] = dailyRevenue;
                monthlyRevenue.push({
                    month: `Thg ${monthIndex + 1}/${year}`,
                    key: monthKey,
                    revenue: revenueByMonth[monthKey] || 0
                });
            }

            resolve({
                errCode: 0,
                data: {
                    totalUsers,
                    totalHotels,
                    totalBookings,
                    totalRevenue,
                    totalCompletedBookings,
                    monthlyRevenue,
                    dailyRevenueByMonth,
                    bookingStatusCounts
                }
            });

        } catch (e) {

            reject(e);
        }
    });
};

/*
========================================
Sửa khách sạn
========================================
*/
let editHotel = (data) => {

    return new Promise(async (resolve, reject) => {

        try {

            let hotel =
                await db.hotels.findOne({

                    where: {
                        id: data.id
                    }
                });

            if (!hotel) {

                resolve({

                    errCode: 1,

                    errMessage: "Hotel not found"
                });

                return;
            }

            // UPDATE HOTEL

            await db.hotels.update(

                {

                    name: data.name,

                    city: data.city,

                    address: data.address,

                    description: data.description,

                    rating: data.rating,

                    thumbnail:
                        data.thumbnail
                            ? data.thumbnail
                            : hotel.thumbnail
                },

                {

                    where: {
                        id: data.id
                    }
                }
            );

            // UPDATE HOTEL IMAGES

            if (
                data.images &&
                data.images.length > 0
            ) {

                // DELETE OLD IMAGES

                await db.hotels_images.destroy({

                    where: {
                        hotel_id: data.id
                    }
                });

                // CREATE NEW IMAGES

                for (
                    let i = 0;
                    i < data.images.length;
                    i++
                ) {

                    await db.hotels_images.create({

                        hotel_id: data.id,

                        image_url: data.images[i]
                    });
                }
            }

            resolve({

                errCode: 0,

                errMessage: "Update hotel success!"
            });

        } catch (e) {

            console.log(e);

            reject(e);
        }
    });
};

/*
========================================
Sửa phòng
========================================
*/


/*
========================================
Checkin booking
========================================
*/


/*
========================================
Checkout booking
========================================
*/


/*
========================================
Upload hotel image
========================================
*/
let uploadHotelImage = (data) => {
    return new Promise(async (resolve, reject) => {

        try {

            await db.hotels_images.create({

                hotel_id: data.hotel_id,

                image_url: data.image_url
            });

            resolve({
                errCode: 0,
                errMessage: "Upload image success!"
            });

        } catch (e) {
            reject(e);
        }
    });
};


module.exports = {
    getAllHotels,
    getHotelDetail,
    getHotelsByCity,
    searchHotels,

    createReview,
    getReviewByHotel,

    createHotel,
    deleteHotel,

    adminDashboard,
    editHotel,


    uploadHotelImage
};
