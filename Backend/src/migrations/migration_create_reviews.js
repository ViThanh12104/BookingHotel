'use strict';
/** @type {import('sequelize-cli').Migration} */

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('reviews', {
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

            booking_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                unique: true,
                references: {
                    model: 'bookings',
                    key: 'id'
                },
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE'
            },

            comment: {
                type: Sequelize.TEXT
            },

            rating: {
                type: Sequelize.FLOAT,
                defaultValue: 0
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
        await queryInterface.dropTable('reviews');
    }
};