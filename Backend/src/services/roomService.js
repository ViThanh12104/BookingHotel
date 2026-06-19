import db from "../models/index";
import Sequelize from "sequelize";

const Op = Sequelize.Op;

const toBoolean = (value) => {
    return value === true || value === "true" || value === "1" || value === 1;
};

let createRoom = (data) => {
    return new Promise(async (resolve, reject) => {

        try {

            let room = await db.rooms.create({
                hotel_id: Number(data.hotel_id),
                room_type: data.room_type,
                price: Number(data.price),
                bed_info: data.bed_info,
                size: data.size,
                free_cancel: toBoolean(data.free_cancel),
                breakfast_included: toBoolean(data.breakfast_included),
                pay_at_hotel: toBoolean(data.pay_at_hotel),
                available_count: Number(data.available_count)
            });

            if (
                data.images &&
                data.images.length > 0
            ) {
                for (let i = 0; i < data.images.length; i++) {
                    await db.room_images.create({
                        room_id: room.id,
                        image_url: data.images[i]
                    });
                }
            }

            resolve({
                errCode: 0,
                errMessage: "Create room success!"
            });

        } catch (e) {
            reject(e);
        }
    });
};

let deleteRoom = (roomId) => {
    return new Promise(async (resolve, reject) => {

        try {

            await db.rooms.destroy({
                where: {
                    id: roomId
                }
            });

            resolve({
                errCode: 0,
                errMessage: "Delete room success!"
            });

        } catch (e) {
            reject(e);
        }
    });
};

let editRoom = (data) => {
    return new Promise(async (resolve, reject) => {

        try {

            let room = await db.rooms.findOne({
                where: {
                    id: data.id
                },
                raw: false
            });

            if (!room) {

                return resolve({
                    errCode: 1,
                    errMessage: "Room not found!"
                });
            }

            room.hotel_id = Number(data.hotel_id);
            room.room_type = data.room_type;
            room.price = Number(data.price);
            room.bed_info = data.bed_info;
            room.size = data.size;

            room.free_cancel =
                toBoolean(data.free_cancel);

            room.breakfast_included =
                toBoolean(data.breakfast_included);

            room.pay_at_hotel =
                toBoolean(data.pay_at_hotel);

            room.available_count =
                Number(data.available_count);

            await room.save();

            if (
                data.images &&
                data.images.length > 0
            ) {
                await db.room_images.destroy({
                    where: {
                        room_id: data.id
                    }
                });

                for (let i = 0; i < data.images.length; i++) {
                    await db.room_images.create({
                        room_id: data.id,
                        image_url: data.images[i]
                    });
                }
            }

            resolve({
                errCode: 0,
                errMessage: "Update room success!"
            });

        } catch (e) {
            reject(e);
        }
    });
};

let getRoomsByHotel = (hotelId) => {
    return new Promise(async (resolve, reject) => {
        try {

            let data = await db.rooms.findAll({

                where: {
                    hotel_id: hotelId
                },

                include: [
                    {
                        model: db.room_images,
                        as: "roomImages",
                        attributes: [
                            "id",
                            "image_url"
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

let adminGetRoomsByHotel =
    (hotelId) => {

        return new Promise(
            async (resolve, reject) => {

                try {

                    let rooms =
                        await db.rooms.findAll({

                            where: {
                                hotel_id: hotelId
                            },

                            include: [

                                {
                                    model: db.room_images,

                                    as: "roomImages",

                                    attributes: [
                                        "id",
                                        "image_url"
                                    ]
                                },

                                {
                                    model: db.hotels,

                                    as: "hotel",

                                    attributes: [
                                        "id",
                                        "name"
                                    ]
                                }

                            ],

                            raw: false,

                            nest: true
                        });

                    resolve({

                        errCode: 0,

                        errMessage: "OK",

                        rooms: rooms
                    });

                } catch (e) {

                    reject(e);
                }
            });
    };

module.exports = {
    createRoom,
    editRoom,
    deleteRoom,
    getRoomsByHotel,
    adminGetRoomsByHotel
};
