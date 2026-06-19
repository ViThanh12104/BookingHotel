'use strict';
const {
    Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class rooms extends Model {
        static associate(models) {

            // Room thuộc về 1 khách sạn
            rooms.belongsTo(models.hotels, {
                foreignKey: 'hotel_id',
                targetKey: 'id',
                as: 'hotel'
            });

            // 1 room có nhiều ảnh
            rooms.hasMany(models.room_images, {
                foreignKey: 'room_id',
                as: 'roomImages'
            });

            // 1 room có nhiều booking
            rooms.hasMany(models.bookings, {
                foreignKey: 'room_id',
                as: 'roomBookings'
            });
        }
    }

    rooms.init({
        // khóa ngoại tới bảng hotels
        hotel_id: DataTypes.INTEGER,

        // loại phòng
        room_type: DataTypes.STRING,

        // giá phòng / đêm
        price: DataTypes.DECIMAL(10, 2),

        // thông tin giường
        bed_info: DataTypes.STRING,

        // diện tích phòng
        size: DataTypes.STRING,

        // miễn phí hủy phòng
        free_cancel: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },

        // bao gồm bữa sáng
        breakfast_included: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },

        // thanh toán tại khách sạn
        pay_at_hotel: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },

        // số lượng phòng còn lại
        available_count: {
            type: DataTypes.INTEGER,
        },



    }, {
        sequelize,
        modelName: 'rooms',
    });

    return rooms;
};