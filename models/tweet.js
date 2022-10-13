'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Tweet extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    get tweetDate() {
      return this.createdAt.toISOString().slice(0, 10)
    }

    static associate(models) {
      // define association here
      Tweet.belongsTo(models.User,  {
        foreignKey: 'UserId'
      });  
    }
  }
  Tweet.init({
    tweet: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Tweet cannot be empty'
        },
        notEmpty: {
          msg: 'Tweet cannot be empty'
        },
        len: {
          args: [1, 280],
          msg: 'Tweet has to contain between 1 to 280 characters'
        }
      }   
    },
    imageURL: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'ImageURL cannot be empty'
        },
        notEmpty: {
          msg: 'ImageURL cannot be empty'
        },
        isUrl: {
          msg: 'Please enter valid URL'
        }
      }   
    },
    UserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'UserId cannot be empty'
        },
        notEmpty: {
          msg: 'UserId cannot be empty'
        }
      }   
    }
  }, {
    sequelize,
    modelName: 'Tweet',
  });
  return Tweet;
};