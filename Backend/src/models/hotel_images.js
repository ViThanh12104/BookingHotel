'use strict';
const {
    Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class hotels_images extends Model {
        static associate(models) {
            // 1 ảnh thuộc về 1 khách sạn
            hotels_images.belongsTo(models.hotels, {
                foreignKey: 'hotel_id',
                targetKey: 'id',
                as: 'hotel'
            });
        }
    }

    hotels_images.init({
        hotel_id: DataTypes.INTEGER,
        image_url: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'hotels_images',
    });

    return hotels_images;
};