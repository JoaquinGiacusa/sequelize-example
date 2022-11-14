const Sequelize = require("sequelize")
const config = require("../config/config.json")

const sequelize = new Sequelize(config.local.database, config.local.username, config.local.password, {
  host: config.local.host,
  dialect: config.local.dialect
});

module.exports = sequelize