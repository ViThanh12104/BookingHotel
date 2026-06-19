'use strict';
/** @type {import('sequelize-cli').Migration} */

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('rooms', {
            id: {
                allowNull: false,
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },

            hotel_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'hotels',
                    key: 'id'
                },
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE'
            },

            room_type: {
                type: Sequelize.STRING,
                allowNull: false
            },

            price: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: false
            },

            status: {
                type: Sequelize.ENUM(
                    'available',
                    'booked',
                    'maintenance'
                ),
                defaultValue: 'available'
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
        await queryInterface.dropTable('rooms');
    }
};