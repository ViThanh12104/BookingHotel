'use strict';
/** @type {import('sequelize-cli').Migration} */

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('hotels', {
            id: {
                allowNull: false,
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            }, 

            name: {
                type: Sequelize.STRING,
                allowNull: false
            },

            city: {
                type: Sequelize.STRING,
                allowNull: false
            },

            address: {
                type: Sequelize.STRING,
                allowNull: false
            },

            description: {
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
        await queryInterface.dropTable('hotels');
    }
};