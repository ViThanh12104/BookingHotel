import axios from '../axios';

/*
========================================
HOTEL
========================================
*/

// lấy tất cả khách sạn
const getAllHotels = () => {
    return axios.get("/api/get-all-hotels");
};

// lấy chi tiết khách sạn
const getHotelDetail = (hotelId) => {
    return axios.get(`/api/get-detail-hotel?id=${hotelId}`);
};

// tạo khách sạn
const createNewHotel = (data) => {
    return axios.post("/api/create-hotel", data);
};

// cập nhật khách sạn
const updateHotel = (data) => {
    return axios.put("/api/edit-hotel", data);
};

// xóa khách sạn
const deleteHotel = (hotelId) => {
    return axios.delete("/api/delete-hotel", {
        data: {
            id: hotelId
        }
    });
};

// dashboard admin
const getAdminDashboard = () => {
    return axios.get('/api/admin/dashboard');
};

// tìm kiếm khách sạn
const searchHotels = (keyword) => {
    return axios.get(`/api/search-hotels?keyword=${keyword}`);
};

// lấy khách sạn theo thành phố
const getHotelsByCity = (city) => {
    return axios.get(`/api/get-hotels-by-city?city=${city}`);
};

// upload ảnh hotel
const uploadHotelImage = (data) => {
    return axios.post(
        "/api/upload-hotel-image",
        data
    );
};

/*
========================================
ROOM
========================================
*/

const adminGetRoomsByHotel = (hotelId) => {

    return axios.get(

        `/api/admin/get-rooms-by-hotel?hotelId=${hotelId}`

    );
};

// lấy room theo hotel
const getRoomsByHotel = (hotelId) => {
    return axios.get(
        `/api/get-rooms-by-hotel?hotelId=${hotelId}`
    );
};

// tạo room
const createRoom = (data) => {
    return axios.post(
        "/api/create-room",
        data
    );
};

// edit room
const editRoom = (data) => {
    return axios.put(
        "/api/edit-room",
        data
    );
};

// delete room
const deleteRoom = (roomId) => {
    return axios.delete(
        "/api/delete-room",
        {
            data: {
                id: roomId
            }
        }
    );
};

/*
========================================
BOOKING
========================================
*/

// tạo booking
const createBooking = (data) => {
    return axios.post(
        "/api/create-booking",
        data
    );
};

// lấy booking theo user
const getBookingByUser = (userId) => {
    return axios.get(
        `/api/get-booking-by-user?userId=${userId}`
    );
};

// hủy booking
const cancelBooking = (bookingId) => {
    return axios.put(
        "/api/admin-cancel-booking",
        {
            id: bookingId
        }
    );
};

// lấy tất cả booking
const getAllBookings = () => {
    return axios.get(
        "/api/get-all-bookings"
    );
};

// xác nhận booking
const confirmBooking = (bookingId) => {
    return axios.put(
        "/api/confirm-booking",
        {
            id: bookingId
        }
    );
};

// checkin booking
const checkinBooking = (bookingId) => {
    return axios.put(
        "/api/checkin-booking",
        {
            id: bookingId
        }
    );
};

// checkout booking
const checkoutBooking = (bookingId) => {
    return axios.put(
        "/api/checkout-booking",
        {
            id: bookingId
        }
    );
};

/*
========================================
USER
========================================
*/

// login
const login = (email, password) => {
    return axios.post(
        "/api/login",
        {
            email,
            password
        }
    );
};

// register
const register = (data) => {
    return axios.post(
        "/api/register",
        data
    );
};

// lấy tất cả user
const getAllUsers = () => {
    return axios.get(
        "/api/get-all-users"
    );
};

// tạo user
const createNewUser = (data) => {
    return axios.post(
        "/api/create-new-user",
        data
    );
};

// edit user
const editUser = (data) => {
    return axios.put(
        "/api/edit-user",
        data
    );
};

// delete user
const deleteUser = (userId) => {
    return axios.delete(
        "/api/delete-user",
        {
            data: {
                id: userId
            }
        }
    );
};

export default {

    // HOTEL
    getAllHotels,
    getHotelDetail,
    createNewHotel,
    updateHotel,
    deleteHotel,
    getAdminDashboard,
    searchHotels,
    getHotelsByCity,
    uploadHotelImage,

    // ROOM
    adminGetRoomsByHotel,
    getRoomsByHotel,
    createRoom,
    editRoom,
    deleteRoom,

    // BOOKING
    createBooking,
    getBookingByUser,
    cancelBooking,
    getAllBookings,
    confirmBooking,
    checkinBooking,
    checkoutBooking,

    // USER
    login,
    register,
    getAllUsers,
    createNewUser,
    editUser,
    deleteUser
};