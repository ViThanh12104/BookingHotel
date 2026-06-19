'use strict';
const {
    Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class notifications extends Model {
        static associate(models) {
            // Notification thuộc về 1 user
            notifications.belongsTo(models.users, {
                foreignKey: 'user_id',
                targetKey: 'id',
                as: 'notificationUser'
            });
        }
    }

    notifications.init({
        user_id: DataTypes.INTEGER,
        message: DataTypes.STRING,
        is_read: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    }, {
        sequelize,
        modelName: 'notifications',
    });

    return notifications;
};