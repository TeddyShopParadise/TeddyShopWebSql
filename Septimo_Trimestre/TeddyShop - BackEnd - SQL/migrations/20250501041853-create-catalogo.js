'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Catalogos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nombreCatalogo: {
        type: Sequelize.STRING
      },
      descripcionCatalogo: {
        type: Sequelize.STRING
      },
      disponibilidadCatalogo: {
        type: Sequelize.BOOLEAN
      },
      imagen: {
        type: Sequelize.STRING
      },
      companiaId: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Catalogos');
  }
};