'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Mutual extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Mutual.init({
    UserId: {
      type: DataTypes.STRING
    },
    MutualId: {
      type: DataTypes.STRING
    }
  }, {
    sequelize,
    modelName: 'Mutual',
  });
  return Mutual;
};