'use strict';
const {
    Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class room_images extends Model {
        static associate(models) {
            // 1 ảnh thuộc về 1 room
            room_images.belongsTo(models.rooms, {
                foreignKey: 'room_id',
                targetKey: 'id',
                as: 'roomImageDetail'
            });
        }
    }

    room_images.init({
        room_id: DataTypes.INTEGER,
        image_url: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'room_images',
    });

    return room_images;
};