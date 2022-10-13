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
      const t = this.updatedAt
      const _minutes = t.getMinutes();
      const minutes = _minutes.toString().length == 1 ? '0'+_minutes : _minutes.toString();

      return t.getHours() + ':' + minutes + ' · ' + t.toLocaleDateString({}, {timeZone:"UTC",month:"long", day:"2-digit", year:"numeric"})
    }

    get likesFormat() {
      if (this.likes >= 1000) {
        return `${this.likes/1000}K`
      }
      return this.likes
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
      type: DataTypes.STRING 
    },
    likes: {
      type: DataTypes.INTEGER 
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
  Tweet.beforeCreate((tweet) => {
    tweet.likes = 0;
  });
  return Tweet;
};