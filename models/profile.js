'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Profile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    getAge() {
      return new Date().getFullYear() - new Date(this.dateOfBirth).getFullYear()
    }

    static associate(models) {
      // define association here
      Profile.belongsTo(models.User,  {
        foreignKey: 'UserId'
      });      
    }
  }
  Profile.init({
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'First name cannot be empty'
        },
        notEmpty: {
          msg: 'First name cannot be empty'
        }
      } 
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Last name cannot be empty'
        },
        notEmpty: {
          msg: 'Last name cannot be empty'
        }
      }
    },
    imageURL: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'URL cannot be empty'
        },
        notEmpty: {
          msg: 'URL cannot be empty'
        },
        isUrl: {
          msg: 'Please enter a valid URL'
        }
      }
    },
    dateOfBirth: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Date of birth cannot be empty'
        },
        notEmpty: {
          msg: 'Date of birth cannot be empty'
        }
      }
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
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
    modelName: 'Profile',
  });
  Profile.beforeCreate((profile)=>{
    const GetLocation = require('location-by-ip');
    const SPOTT_API_KEY = '0be96fdc00mshf84f7d6c3db11a4p157843jsn0b25f428c04d';

    const getLocation = new GetLocation(SPOTT_API_KEY);
    const options = {
      language: 'id' // Russian
    };

    const location = getLocation.byMyIp(options);
    location
    .then(data => {
      profile.location = data.name
    })
    .catch(error => {
      console.error(error)
    });
  })
  return Profile;
};