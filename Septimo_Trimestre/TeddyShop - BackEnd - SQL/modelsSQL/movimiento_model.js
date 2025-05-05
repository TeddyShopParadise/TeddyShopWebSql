// modelsSQL/movimiento_model.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Movimiento = sequelize.define('Movimiento', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    fecha: {
      type: DataTypes.DATE,
      allowNull: false
    },
    cantidadIngreso: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'cantidadingreso'
    },
    cantidadVendida: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'cantidadvendida'
    }
  }, {
    tableName: 'movimiento',
    timestamps: false,
    underscored: true
  });

  Movimiento.associate = (models) => {
    Movimiento.belongsTo(models.Inventario, {
      foreignKey: {
        name: 'inventario_id',
        allowNull: false
      },
      as: 'inventario'
    });
  };

  return Movimiento;
};
