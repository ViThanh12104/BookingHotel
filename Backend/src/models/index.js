'use strict';

require('dotenv').config();

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];

const db = {};

console.log("NODE_ENV =", process.env.NODE_ENV);
console.log("DATABASE_URL exists =", !!process.env.DATABASE_URL);

let sequelize;

// Render / Railway
if (process.env.DATABASE_URL) {
    sequelize = new Sequelize(process.env.DATABASE_URL, {
        dialect: 'mysql',
        logging: false,
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        }
    });
} 
// Local
else {
    sequelize = new Sequelize(
        config.database,
        config.username,
        config.password,
        config
    );
}

// Load tất cả model
fs.readdirSync(__dirname)
    .filter(file => {
        return (
            file.indexOf('.') !== 0 &&
            file !== basename &&
            file.slice(-3) === '.js' &&
            file.indexOf('.test.js') === -1
        );
    })
    .forEach(file => {
        try {
            console.log("Loading model:", file);

            const model = require(path.join(__dirname, file))(
                sequelize,
                Sequelize.DataTypes
            );

            console.log("Loaded model:", model.name);

            db[model.name] = model;
        } catch (err) {
            console.error("ERROR loading model:", file);
            console.error(err);
        }
    });

// Associations
Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;