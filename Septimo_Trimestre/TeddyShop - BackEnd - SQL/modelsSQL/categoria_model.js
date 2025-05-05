// models/categoria_model.js
module.exports = (sequelize, DataTypes) => {
  const Categoria = sequelize.define('Categoria', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombreCategoria: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'nombrecategoria'
    },
    descripcionCategoria: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'descripcioncategoria'
    },
    imagen: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    tableName: 'categoria',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  Categoria.associate = (models) => {
    Categoria.belongsToMany(models.Producto, {
      through: 'categoria_producto',
      foreignKey: 'categoria_id',
      otherKey: 'producto_id'
    });
  };

  return Categoria;
};
