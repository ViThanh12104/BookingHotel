import hotelService from "../services/hotelService";
import { asyncHandler } from "../middleware/errorHandler";
import { BadRequestError, NotFoundError } from "../utils/errors";


const BASE_URL = process.env.BASE_URL || 'http://localhost:8080';
/*
========================================
Lấy tất cả khách sạn
API: GET /api/get-all-hotels
========================================
*/
let handleGetAllHotels = asyncHandler(async (req, res) => {
    let hotels = await hotelService.getAllHotels();

    return res.status(200).json({
        errCode: 0,
        errMessage: "OK",
        hotels: hotels
    });
});

/*
========================================
Lấy chi tiết 1 khách sạn theo id
API: GET /api/get-detail-hotel?id=1
========================================
*/
let handleGetHotelDetail = asyncHandler(async (req, res) => {
    let hotelId = req.query.id;

    let hotel = await hotelService.getHotelDetail(hotelId);

    if (!hotel) {
        throw new NotFoundError("Hotel");
    }

    return res.status(200).json({
        errCode: 0,
        errMessage: "OK",
        hotel: hotel
    });
});

/*
========================================
Lấy danh sách khách sạn theo thành phố
API: GET /api/get-hotels-by-city?city=Hà Nội
========================================
*/
let handleGetHotelsByCity = asyncHandler(async (req, res) => {
    let city = req.query.city;

    let hotels = await hotelService.getHotelsByCity(city);

    return res.status(200).json({
        errCode: 0,
        errMessage: "OK",
        hotels: hotels
    });
});

/*
========================================
Tìm kiếm khách sạn theo từ khóa
API: GET /api/search-hotels?keyword=marriott
========================================
*/
let handleSearchHotels = asyncHandler(async (req, res) => {
    let keyword = req.query.keyword;

    let hotels = await hotelService.searchHotels(keyword);

    return res.status(200).json({
        errCode: 0,
        errMessage: "OK",
        hotels: hotels
    });
});

let handleCreateReview = asyncHandler(async (req, res) => {
    let data = req.body;
    data.user_id = req.user.id;

    let message = await hotelService.createReview(data);

    if (message.errCode !== 0) {
        throw new BadRequestError(message.errMessage);
    }

    return res.status(201).json({
        errCode: 0,
        errMessage: message.errMessage,
        review: message.review
    });
});

/*
========================================
Lấy review theo khách sạn
API: GET /api/get-review-by-hotel?hotelId=1
========================================
*/
let handleGetReviewByHotel = asyncHandler(async (req, res) => {
    let hotelId = req.query.hotelId;

    let reviews = await hotelService.getReviewByHotel(hotelId);

    return res.status(200).json({
        errCode: 0,
        errMessage: "OK",
        reviews: reviews
    });
});

let handleEditHotel = asyncHandler(async (req, res) => {
    let data = req.body;

    // THUMBNAIL
    if (req.files && req.files.thumbnail) {
        data.thumbnail = `${BASE_URL}/images/${req.files.thumbnail[0].filename}`;
    }

    // HOTEL IMAGES
    data.images = [];

    if (req.files && req.files.hotelImages) {
        req.files.hotelImages.forEach((item) => {
            data.images.push(`${BASE_URL}/images/${item.filename}`);
        });
    }

    let message = await hotelService.editHotel(data);

    if (message.errCode !== 0) {
        throw new BadRequestError(message.errMessage);
    }

    return res.status(200).json({
        errCode: 0,
        errMessage: message.errMessage,
        hotel: message.hotel
    });
});

let handleCreateHotel = asyncHandler(async (req, res) => {
    let data = req.body;

    // THUMBNAIL
    if (req.files && req.files.thumbnail) {
        data.thumbnail = `${BASE_URL}/images/${req.files.thumbnail[0].filename}`;
    }

    // HOTEL IMAGES
    data.images = [];

    if (req.files && req.files.hotelImages) {
        req.files.hotelImages.forEach((item) => {
            data.images.push(`${BASE_URL}/images/${item.filename}`);
        });
    }

    let message = await hotelService.createHotel(data);

    if (message.errCode !== 0) {
        throw new BadRequestError(message.errMessage);
    }

    return res.status(201).json({
        errCode: 0,
        errMessage: message.errMessage,
        hotel: message.hotel
    });
});

let handleDeleteHotel = asyncHandler(async (req, res) => {
    let hotelId = req.body.id;

    let message = await hotelService.deleteHotel(hotelId);

    if (message.errCode !== 0) {
        throw new NotFoundError("Hotel");
    }

    return res.status(200).json({
        errCode: 0,
        errMessage: message.errMessage
    });
});







let handleAdminDashboard = asyncHandler(async (req, res) => {
    let dashboardData = await hotelService.adminDashboard();

    return res.status(200).json({
        errCode: 0,
        errMessage: "OK",
        data: dashboardData.data
    });
});

let handleUploadHotelImage = asyncHandler(async (req, res) => {
    let message = await hotelService.uploadHotelImage(req.body);

    if (message.errCode !== 0) {
        throw new BadRequestError(message.errMessage);
    }

    return res.status(200).json({
        errCode: 0,
        errMessage: message.errMessage,
        image: message.image
    });
});

export default {
    handleGetAllHotels,
    handleGetHotelDetail,
    handleGetHotelsByCity,
    handleSearchHotels,

    handleCreateReview,
    handleGetReviewByHotel,
    handleEditHotel,

    handleCreateHotel,
    handleDeleteHotel,
    handleAdminDashboard,
    handleUploadHotelImage
};