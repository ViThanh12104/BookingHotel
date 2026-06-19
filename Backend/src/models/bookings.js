'use strict';
const {
    Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class bookings extends Model {
        static associate(models) {
            // Booking thuộc về 1 user
            bookings.belongsTo(models.users, {
                foreignKey: 'user_id',
                targetKey: 'id',
                as: 'bookingUser'
            });

            // Booking thuộc về 1 room
            bookings.belongsTo(models.rooms, {
                foreignKey: 'room_id',
                targetKey: 'id',
                as: 'bookingRoom'
            });
           
                // 1 booking có 1 review
                bookings.hasOne(models.reviews, {
                    foreignKey: 'booking_id',
                    as: 'bookingReview'
                });
        }
    }

    bookings.init({
        user_id: DataTypes.INTEGER,
        room_id: DataTypes.INTEGER,
        check_in: DataTypes.DATE,
        check_out: DataTypes.DATE,
        total_price: DataTypes.DECIMAL(10, 2),
        status: {
            type: DataTypes.ENUM(
                'pending',
                'confirmed',
                'checked_in',
                'completed',
                'cancelled'
            ),
            defaultValue: 'pending'
        }
    }, {
        sequelize,
        modelName: 'bookings',
    });

    return bookings;
};