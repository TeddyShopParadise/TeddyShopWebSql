// modelsSQL/detalle_factura_model.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const DetalleFactura = sequelize.define('DetalleFactura', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    precioDetalleFactura: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false,
      field: 'preciodetallefactura'
    },
    cantidadDetalleFactura: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'cantidaddetallefactura'
    }
  }, {
    tableName: 'detallefactura',
    timestamps: false,
    underscored: true
  });

  DetalleFactura.associate = (models) => {
    DetalleFactura.belongsTo(models.Factura, {
      foreignKey: {
        name: 'idfactura_id',
        allowNull: false
      },
      as: 'factura'
    });
    DetalleFactura.belongsTo(models.Producto, {
      foreignKey: {
        name: 'idproducto_id',
        allowNull: false
      },
      as: 'producto'
    });
    DetalleFactura.belongsTo(models.Inventario, {
      foreignKey: {
        name: 'idinventario_id',
        allowNull: false
      },
      as: 'inventario'
    });
  };

  return DetalleFactura;
};