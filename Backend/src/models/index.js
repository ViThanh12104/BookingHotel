'use strict';

require('dotenv').config();

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const configFile = require(__dirname + '/../config/config.json')[env];
const db = {};

// Build config from environment variables, falling back to config.json
const buildConfig = (env, fileConfig) => {
  console.log("ENV =", env);
console.log("CONFIG =", config);
console.log("DATABASE_URL =", process.env.DATABASE_URL);
  if (env === 'development') {
    return {
      username: process.env.DB_DEV_USERNAME || fileConfig.username,
      password: process.env.DB_DEV_PASSWORD || fileConfig.password,
      database: process.env.DB_DEV_NAME || fileConfig.database,
      host: process.env.DB_DEV_HOST || fileConfig.host,
      port: process.env.DB_DEV_PORT || fileConfig.port,
      dialect: fileConfig.dialect,
      logging: fileConfig.logging,
      query: fileConfig.query,
      timezone: fileConfig.timezone
    };
  } else if (env === 'test') {
    return {
      username: process.env.DB_TEST_USERNAME || fileConfig.username,
      password: process.env.DB_TEST_PASSWORD || fileConfig.password,
      database: process.env.DB_TEST_NAME || fileConfig.database,
      host: process.env.DB_TEST_HOST || fileConfig.host,
      dialect: fileConfig.dialect
    };
  } else if (env === 'production') {
    return {
      username: process.env.DB_PROD_USERNAME || fileConfig.username,
      password: process.env.DB_PROD_PASSWORD || fileConfig.password,
      database: process.env.DB_PROD_NAME || fileConfig.database,
      host: process.env.DB_PROD_HOST || fileConfig.host,
      port: process.env.DB_PROD_PORT || fileConfig.port,
      dialect: fileConfig.dialect
    };
  }
  return fileConfig;
};

// const config = buildConfig(env, configFile);
const config = configFile;
let sequelize;

console.log("NODE_ENV =", process.env.NODE_ENV);
console.log("DATABASE_URL exists =", !!process.env.DATABASE_URL);

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
} else {
    sequelize = new Sequelize(
        config.database,
        config.username,
        config.password,
        config
    );
}
db.Sequelize = Sequelize;

module.exports = db;
