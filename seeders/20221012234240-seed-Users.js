'use strict';
const fs = require('fs');
const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
     let data = JSON.parse(fs.readFileSync('./data/users.json', 'utf-8'))
     data.forEach(el => {
       delete el.firstName
       delete el.lastName
       delete el.imageURL
       delete el.dateOfBirth
       delete el.location
       delete el.UserId
       el.createdAt = new Date()
       el.updatedAt = new Date()

        const salt =  bcrypt.genSaltSync(8);
        const hash =  bcrypt.hashSync(el.password, salt);
        el.password = hash
     });
   return queryInterface.bulkInsert('Users', data, {});
  },

  down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('Users', null, {});
     */
     return queryInterface.bulkDelete('Users', null, {});
  }
};
