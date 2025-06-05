// modelsSQL/inventario_model.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Inventario = sequelize.define('Inventario', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    stockMinimo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'stockminimo'
    },
    precioVenta: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false,
      field: 'precioventa'
    },
    precioCompra: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false,
      field: 'preciocompra'
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    stockMaximo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'stockmaximo'
    }
  }, {
    tableName: 'inventario',
    timestamps: false,
    underscored: true
  });

  Inventario.associate = (models) => {
    Inventario.belongsTo(models.Devoluciones, {
      foreignKey: { name: 'iddevolucion_id', allowNull: true },
      as: 'devolucion'
    });
    Inventario.belongsTo(models.Producto, {
      foreignKey: { name: 'idproducto_id', allowNull: false },
      as: 'producto'
    });
    Inventario.hasMany(models.Movimiento, {
      foreignKey: { name: 'inventario_id', allowNull: false },
      as: 'movimientos'
    });
    Inventario.hasMany(models.DetalleFactura, {
      foreignKey: { name: 'idinventario_id', allowNull: false },
      as: 'detalleFacturas'
    });
  };

  return Inventario;
};
