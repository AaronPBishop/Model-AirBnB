'use strict';
const bcrypt = require("bcryptjs");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [
      {
        firstName: 'Ronnie',
        lastName: 'Coleman',
        email: 'demo@user.io',
        username: 'FakeUser',
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        firstName: 'Jennifer',
        lastName: 'Lawrence',
        email: 'user1@user.io',
        username: 'FakeUser2',
        hashedPassword: bcrypt.hashSync('password2')
      },
      {
        firstName: 'Chad',
        lastName: 'Vix',
        email: 'user2@user.io',
        username: 'FakeUser3',
        hashedPassword: bcrypt.hashSync('password3')
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete('Users', {
      username: { [Op.in]: ['FakeUser', 'FakeUser1', 'FakeUser2'] }
    }, {});
  }
};