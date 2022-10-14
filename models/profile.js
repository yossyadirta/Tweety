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

    get joinedDate() {
      const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
      const d = this.createdAt
      let month = months[d.getMonth()];
      let year = d.getFullYear()

      return `${month} ${year}`
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
      allowNull: false
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
    // if (profile.image.length === 0) {
    //   profile.imageURL = 'https://i.pinimg.com/originals/a6/58/32/a65832155622ac173337874f02b218fb.png'
    // }
    
    const GetLocation = require('location-by-ip');
    const SPOTT_API_KEY = '0be96fdc00mshf84f7d6c3db11a4p157843jsn0b25f428c04d';

    const getLocation = new GetLocation(SPOTT_API_KEY);
    const options = {
      language: 'id' // Russian
    };

    let locs;
    const location = getLocation.byMyIp(options);
    return location
    .then(data => {
      // console.log(data);
      // console.log(profile);
      profile.location = data.name
    })
    .catch(error => {
      console.error(error)
    });
  })
  return Profile;
};