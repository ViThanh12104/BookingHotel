'use strict';
/** @type {import('sequelize-cli').Migration} */

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('bookings', {
            id: {
                allowNull: false,
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },

            user_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id'
                },
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE'
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

            check_in: {
                type: Sequelize.DATE
            },

            check_out: {
                type: Sequelize.DATE
            },

            total_price: {
                type: Sequelize.DECIMAL(10, 2)
            },

            status: {
                type: Sequelize.ENUM(
                    'pending',
                    'confirmed',
                    'cancelled'
                ),
                defaultValue: 'pending'
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
        await queryInterface.dropTable('bookings');
    }
};