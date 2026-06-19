'use strict';
const {
    Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class hotels extends Model {
        static associate(models) {

            // 1 khách sạn có nhiều ảnh chi tiết
            hotels.hasMany(models.hotels_images, {
                foreignKey: 'hotel_id',
                as: 'hotelImages'
            });

            // 1 khách sạn có nhiều phòng
            hotels.hasMany(models.rooms, {
                foreignKey: 'hotel_id',
                as: 'rooms'
            });
        }
    }

    hotels.init({
        name: DataTypes.STRING,
        city: DataTypes.STRING,
        address: DataTypes.STRING,
        description: DataTypes.TEXT,
        rating: DataTypes.FLOAT,

        // ảnh đại diện chính
        thumbnail: DataTypes.STRING

    }, {
        sequelize,
        modelName: 'hotels',
    });

    return hotels;
};