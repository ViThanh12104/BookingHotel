'use strict';
const {
    Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class users extends Model {
        static associate(models) {
            // 1 user có nhiều booking
            users.hasMany(models.bookings, {
                foreignKey: 'user_id',
                as: 'userBookings'
            });

            // 1 user có nhiều review
            users.hasMany(models.reviews, {
                foreignKey: 'user_id',
                as: 'userReviews'
            });

            // 1 user có nhiều notification
            users.hasMany(models.notifications, {
                foreignKey: 'user_id',
                as: 'userNotifications'
            });
        }
    }

    users.init({
        name: DataTypes.STRING,
        email: DataTypes.STRING,
        password: DataTypes.STRING,
        phone: DataTypes.STRING,
        address: DataTypes.STRING,
        gender: DataTypes.BOOLEAN,
        role: {
            type: DataTypes.ENUM('admin', 'customer'),
            defaultValue: 'customer'
        }
    }, {
        sequelize,
        modelName: 'users',
    });

    return users;
};