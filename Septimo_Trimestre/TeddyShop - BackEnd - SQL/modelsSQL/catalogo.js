'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Catalogo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Catalogo.init({
    nombreCatalogo: DataTypes.STRING,
    descripcionCatalogo: DataTypes.STRING,
    disponibilidadCatalogo: DataTypes.BOOLEAN,
    imagen: DataTypes.STRING,
    companiaId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Catalogo',
  });
  return Catalogo;
};