// modelsSQL/cliente_model.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Cliente = sequelize.define('Cliente', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombrecliente: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'nombrecliente'
    },
    telefonocliente: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'telefonocliente' 
    }
  }, {
    tableName: 'cliente',
    timestamps: false
  });

  Cliente.associate = (models) => {
    Cliente.hasMany(models.Pedido, {
      foreignKey: 'cliente_id',
      as: 'pedidos'
    });
    Cliente.hasMany(models.Factura, {
      foreignKey: 'cliente_id',
      as: 'facturas'
    });
  };

  return Cliente;
};
