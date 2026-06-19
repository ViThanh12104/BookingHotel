'use strict';
const {
    Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class reviews extends Model {
        static associate(models) {
            // Review thuộc về 1 user
            reviews.belongsTo(models.users, {
                foreignKey: 'user_id',
                targetKey: 'id',
                as: 'reviewUser'
            });

            // Review thuộc về 1 khách sạn
            reviews.belongsTo(models.hotels, {
                foreignKey: 'hotel_id',
                targetKey: 'id',
                as: 'reviewHotel'
            });

            // Review thuộc về 1 booking
            reviews.belongsTo(models.bookings, {
                foreignKey: 'booking_id',
                targetKey: 'id',
                as: 'bookingReview'
            });
        }
    }

    reviews.init({
        user_id: DataTypes.INTEGER,
        hotel_id: DataTypes.INTEGER,
        booking_id: DataTypes.INTEGER,
        comment: DataTypes.TEXT,
        rating: DataTypes.FLOAT
    }, {
        sequelize,
        modelName: 'reviews',
    });

    return reviews;
};