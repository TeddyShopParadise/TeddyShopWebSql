module.exports = (sequelize, DataTypes) => {
  const Producto = sequelize.define('Producto', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    estiloProducto: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'estiloproducto'
    },
    disponibilidadProducto: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'disponibilidadproducto',
      validate: {
        min: 0
      }
    },
    tamanoproducto: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'tamanoproducto'
    },
    imagen: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    historial_precio_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'historialprecio', 
        key: 'id'
      },
      field: 'historial_precio_id'
    }
  }, {
    tableName: 'producto',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  Producto.associate = (models) => {
    Producto.belongsToMany(models.Catalogo, {
      through: {
        model: 'catalogo_producto',
        schema: 'public',
        tableName: 'catalogo_producto'
      },
      foreignKey: 'producto_id',
      otherKey: 'catalogo_id',
      as: 'Catalogos' 
    });

    Producto.belongsToMany(models.Categoria, {
      through: 'categoria_producto',
      as: 'Categorias',
      foreignKey: 'producto_id',
      otherKey: 'categoria_id'
    });

    // Relación uno a uno: Producto pertenece a un HistorialPrecio
    Producto.belongsTo(models.HistorialPrecio, {
      foreignKey: 'historial_precio_id',
      as: 'HistorialPrecio'
    });
  };

  return Producto;
};
