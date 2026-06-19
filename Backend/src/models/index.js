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

const config = buildConfig(env, configFile);

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
