// modelsSQL/factura_model.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Factura = sequelize.define('Factura', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    fechaCreacionFactura: {
      type: DataTypes.DATEONLY,
      defaultValue: DataTypes.NOW,
      field: 'fechacreacionfactura'
    },
    horaCreacionFactura: {
      type: DataTypes.TIME,
      defaultValue: DataTypes.NOW,
      field: 'horacreacionfactura'
    }
  }, {
    tableName: 'factura',
    timestamps: false,
    underscored: true
  });

  Factura.associate = (models) => {
    Factura.belongsTo(models.Pedido, {
      foreignKey: {
        name: 'pedido_id',
        allowNull: true
      },
      as: 'pedido'
    });
    Factura.belongsTo(models.Cliente, {
      foreignKey: {
        name: 'cliente_id',
        allowNull: false
      },
      as: 'cliente'
    });
    Factura.belongsTo(models.MetodoPago, {
      foreignKey: {
        name: 'metodopago_id',
        allowNull: false
      },
      as: 'metodoPago'
    });
    Factura.hasMany(models.DetalleFactura, {
      foreignKey: {
        name: 'idfactura_id',
        allowNull: false
      },
      as: 'detallesFactura'
    });
  };

  return Factura;
};