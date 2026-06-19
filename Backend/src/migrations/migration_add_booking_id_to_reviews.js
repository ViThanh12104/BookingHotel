'use strict';
/** @type {import('sequelize-cli').Migration} */

module.exports = {
    async up(queryInterface, Sequelize) {
        // Add booking_id column if it does not exist
        await queryInterface.addColumn('reviews', 'booking_id', {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: {
                model: 'bookings',
                key: 'id'
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn('reviews', 'booking_id');
    }
};
