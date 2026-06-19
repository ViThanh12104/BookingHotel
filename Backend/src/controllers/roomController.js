import roomService from "../services/roomService";
import { asyncHandler } from "../middleware/errorHandler";
import { BadRequestError, NotFoundError } from "../utils/errors";

let handleEditRoom = asyncHandler(async (req, res) => {
    let payload = req.body;

    payload.images = [];

    if (
        req.files &&
        req.files.roomImages
    ) {
        req.files.roomImages.forEach(item => {
            payload.images.push(
                `http://localhost:8080/images/${item.filename}`
            );
        });
    }

    let data = await roomService.editRoom(payload);

    if (data.errCode !== 0) {
        throw new NotFoundError("Room");
    }

    return res.status(200).json({
        errCode: 0,
        errMessage: data.errMessage,
        room: data.room
    });
});

let handleCreateRoom = asyncHandler(async (req, res) => {
    let payload = req.body;

    payload.images = [];

    if (
        req.files &&
        req.files.roomImages
    ) {
        req.files.roomImages.forEach(item => {
            payload.images.push(
                `http://localhost:8080/images/${item.filename}`
            );
        });
    }

    let message = await roomService.createRoom(payload);

    if (message.errCode !== 0) {
        throw new BadRequestError(message.errMessage);
    }

    return res.status(201).json({
        errCode: 0,
        errMessage: message.errMessage,
        room: message.room
    });
});

let handleDeleteRoom = asyncHandler(async (req, res) => {
    let roomId = req.body.id;

    let message = await roomService.deleteRoom(roomId);

    if (message.errCode !== 0) {
        throw new NotFoundError("Room");
    }

    return res.status(200).json({
        errCode: 0,
        errMessage: message.errMessage
    });
});

let handleGetRoomsByHotel = asyncHandler(async (req, res) => {
    let hotelId = req.query.hotelId;

    let rooms = await roomService.getRoomsByHotel(hotelId);

    return res.status(200).json({
        errCode: 0,
        rooms: rooms
    });
});

let handleAdminGetRoomsByHotel = asyncHandler(async (req, res) => {
    let hotelId = req.query.hotelId;

    let data = await roomService.adminGetRoomsByHotel(hotelId);

    return res.status(200).json(data);
});

export default {
    handleEditRoom,
    handleCreateRoom,
    handleDeleteRoom,
    handleGetRoomsByHotel,
    handleAdminGetRoomsByHotel
};
