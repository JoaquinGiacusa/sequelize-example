'use strict';
const {
  Model,
  DataTypes
} = require('sequelize');
const sequelize = require("./index")

class Product extends Model {
}


module.exports = Product.init({
  name: DataTypes.STRING,
  brand: DataTypes.STRING,
  price: DataTypes.NUMBER
}, {
  sequelize,
  modelName: 'product',
});