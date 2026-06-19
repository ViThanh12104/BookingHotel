'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('users', {
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

            email: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true
            },

            password: {
                type: Sequelize.STRING,
                allowNull: false
            },

            phone: {
                type: Sequelize.STRING
            },

            address: {
                type: Sequelize.STRING
            },

            gender: {
                type: Sequelize.BOOLEAN
            },

            role: {
                type: Sequelize.ENUM(
                    'admin',
                    'customer'
                ),
                defaultValue: 'customer'
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
        await queryInterface.dropTable('users');
    }
};