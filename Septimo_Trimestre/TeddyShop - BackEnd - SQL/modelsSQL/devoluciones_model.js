// modelsSQL/devoluciones_model.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Devoluciones = sequelize.define('Devoluciones', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    detalleDevolucion: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: 'detalledevolucion'
    }
  }, {
    tableName: 'devoluciones',
    timestamps: false,
    underscored: true
  });

  Devoluciones.associate = (models) => {
    Devoluciones.hasMany(models.Inventario, {
      foreignKey: {
        name: 'iddevolucion_id',
        allowNull: true
      },
      as: 'inventarios'
    });
  };

  return Devoluciones;
};
