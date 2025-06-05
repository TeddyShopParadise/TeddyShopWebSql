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
      field: 'preciodetallepedido' // Nombre real en la BD
    },
    cantidadDetallePedido: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'cantidaddetallepedido' // Nombre real en la BD
    },
    // Agregar explícitamente las claves foráneas como atributos
    idpedido_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    idproducto_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'detallepedido',
    timestamps: false,
    underscored: true
  });

  DetallePedido.associate = (models) => {
    DetallePedido.belongsTo(models.Pedido, {
      foreignKey: 'idpedido_id', // Simplificado
      as: 'pedido'
    });
    DetallePedido.belongsTo(models.Producto, {
      foreignKey: 'idproducto_id', // Simplificado
      as: 'producto'
    });
  };

  return DetallePedido;
};