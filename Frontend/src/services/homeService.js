import axios from "../axios";

/*
========================================
Lấy tất cả khách sạn
GET: /api/get-all-hotels
========================================
*/
const getAllHotels = () => {
    return axios.get("/api/get-all-hotels");
};

/*
========================================
Lấy chi tiết 1 khách sạn
GET: /api/get-detail-hotel?id=1
========================================
*/
const getHotelDetail = (hotelId) => {
    return axios.get(`/api/get-detail-hotel?id=${hotelId}`);
};

/*
========================================
Lấy khách sạn theo thành phố
GET: /api/get-hotels-by-city?city=Hà Nội
========================================
*/
const getHotelsByCity = (city) => {
    return axios.get(`/api/get-hotels-by-city?city=${city}`);
};

/*
========================================
Tìm kiếm khách sạn theo keyword
GET: /api/search-hotels?keyword=marriott
========================================
*/
const searchHotels = (keyword) => {
    return axios.get(`/api/search-hotels?keyword=${keyword}`);
};

/*
========================================
Tạo booking đặt phòng
POST: /api/create-booking
========================================
*/
const createBooking = (data) => {
    return axios.post("/api/create-booking", data);
};

/*
========================================
Lấy booking theo user
GET: /api/get-booking-by-user?userId=1
========================================
*/
const getBookingByUser = (userId) => {
    return axios.get(`/api/get-booking-by-user?userId=${userId}`);
};

/*
========================================
Hủy booking
PUT: /api/cancel-booking
========================================
*/
const cancelBooking = (bookingId, userId) => {
    return axios.put("/api/cancel-booking", {
        id: bookingId,
        userId: userId
    });
};

/*
========================================
Tạo review khách sạn
POST: /api/create-review
========================================
*/
const createReview = (data) => {
    return axios.post("/api/create-review", data);
};

/*
========================================
Lấy review theo khách sạn
GET: /api/get-review-by-hotel?hotelId=1
========================================
*/
const getReviewByHotel = (hotelId) => {
    return axios.get(`/api/get-review-by-hotel?hotelId=${hotelId}`);
};

/*
========================================
Tạo khách sạn mới (admin)
POST: /api/create-hotel
========================================
*/


export default {
    getAllHotels,
    getHotelDetail,
    getHotelsByCity,
    searchHotels,
    createBooking,
    getBookingByUser,
    cancelBooking,
    createReview,
    getReviewByHotel
};