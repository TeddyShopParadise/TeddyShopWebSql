// modelsSQL/MetodoPago.js

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const MetodoPago = sequelize.define('MetodoPago', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombremetodopago: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'nombremetodopago'
    }
  }, {
    tableName: 'metodopago',
    timestamps: false
  });

  return MetodoPago;
};
