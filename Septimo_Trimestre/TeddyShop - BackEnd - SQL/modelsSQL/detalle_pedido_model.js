// modelsSQL/detalle_pedido_model.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const DetallePedido = sequelize.define('DetallePedido', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    precioDetallePedido: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false,
      field: 'preciodetallepedido'
    },
    cantidadDetallePedido: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'cantidaddetallepedido'
    }
  }, {
    tableName: 'detallepedido',
    timestamps: false,
    underscored: true
  });

  DetallePedido.associate = (models) => {
    DetallePedido.belongsTo(models.Pedido, {
      foreignKey: {
        name: 'pedido_id',
        allowNull: false
      },
      as: 'pedido'
    });
    DetallePedido.belongsTo(models.Producto, {
      foreignKey: {
        name: 'producto_id',
        allowNull: false
      },
      as: 'producto'
    });
  };

  return DetallePedido;
};