'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasOne(models.Profile, {
        foreignKey: 'UserId'
      });
      User.hasMany(models.Tweet, {
        foreignKey: 'UserId'
      });
      User.belongsToMany(User, {
        through: models.Mutual,
        as: "Users",
        foreignKey: 'UserId'
      });
      User.belongsToMany(User, {
        through: models.Mutual,
        as: "Mutuals",
        foreignKey: 'MutualId'
      });
    }
  }
  User.init({
    email: { 
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'please enter email'
        },
        notEmpty: {
          msg: 'please enter email'
        },
        isEmail: {
          msg: 'Please enter valid email'
        }
      } 
    },
    username: { 
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        // args: true,
        msg: 'Username already in use!'
      },
      validate: {
        notNull: {
          msg: 'Please enter username'
        },
        notEmpty: {
          msg: 'Please enter username'
        }
      }  
    },
    role: { 
      type: DataTypes.STRING,
      // allowNull: false,
      // validate: {
      //   notNull: {
      //     msg: 'role cannot be empty'
      //   },
      //   notEmpty: {
      //     msg: 'role cannot be empty'
      //   }
      // }  
    },
    password: { 
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'please enter email'
        },
        notEmpty: {
          msg: 'please enter email'
        },
        isAlphanumeric: {
          msg: 'Password must contain number and alphabet'
        },
        len: {
          args: [8, 16],
          msg: 'Password length must be between 8 to 16 characters'
        }
      }  
    },
    isVerified: {
      type: DataTypes.BOOLEAN
    },
  }, {
    sequelize,
    modelName: 'User',
  });
  
  User.beforeCreate((user) => {
    user.isVerified = false;
    user.role = 'user'
  });
  return User;
};
