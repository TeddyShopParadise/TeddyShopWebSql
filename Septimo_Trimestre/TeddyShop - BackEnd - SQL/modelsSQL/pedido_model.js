// modelsSQL/pedido_model.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Pedido = sequelize.define('Pedido', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombreComprador: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'nombrecomprador'
    },
    numeroComprador: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'numerocomprador'
    },
    nombreAgendador: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'nombreagendador'
    },
    numeroAgendador: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'numeroagendador'
    },
    localidad: {
      type: DataTypes.STRING,
      allowNull: true
    },
    direccion: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    barrio: {
      type: DataTypes.STRING,
      allowNull: true
    },
    estado: {
      type: DataTypes.ENUM('pendiente', 'en_proceso', 'realizado'),
      defaultValue: 'en_proceso'
    }
  }, {
    tableName: 'pedido',
    timestamps: false,
    underscored: true
  });

  Pedido.associate = (models) => {
    Pedido.belongsTo(models.Cliente, {
      foreignKey: {
        name: 'cliente_id',
        allowNull: false
      },
      as: 'cliente'
    });
    Pedido.hasMany(models.DetallePedido, {
      foreignKey: 'pedido_id',
      as: 'detallesPedido'
    });
    Pedido.hasMany(models.Factura, {
      foreignKey: 'pedido_id',
      as: 'facturas'
    });
  };

  return Pedido;
};