'use strict';
/** @type {import('sequelize-cli').Migration} */

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('room_images', {
            id: {
                allowNull: false,
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },

            room_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'rooms',
                    key: 'id'
                },
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE'
            },

            image_url: {
                type: Sequelize.STRING
            },

            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },

            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('room_images');
    }
};