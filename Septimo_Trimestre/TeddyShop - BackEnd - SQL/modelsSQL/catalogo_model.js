  // models/catalogo_model.js
  module.exports = (sequelize, DataTypes) => {
      const Catalogo = sequelize.define('Catalogo', {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        nombreCatalogo: {
          type: DataTypes.STRING(100),
          allowNull: false,
          field: 'nombrecatalogo'
        },
        descripcionCatalogo: {
          type: DataTypes.STRING(500),
          field: 'descripcioncatalogo'
        },
        disponibilidadCatalogo: {
          type: DataTypes.BOOLEAN,
          defaultValue: true,
          field: 'disponibilidadcatalogo'
        },
        imagen: {
          type: DataTypes.STRING(255)
        },
        compania_id: {
          type: DataTypes.INTEGER,
          field: 'compania_id'
        }
      }, {
        tableName: 'catalogo',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        underscored: true
      });
    
      Catalogo.associate = (models) => {
        // Relación muchos a muchos con Producto
        Catalogo.belongsToMany(models.Producto, {
          through: {
            model: 'catalogo_producto',
            schema: 'public', 
            tableName: 'catalogo_producto' 
          },
          foreignKey: 'catalogo_id', 
          otherKey: 'producto_id'    
        });
    
        // Relación uno a muchos con Compañía
        Catalogo.belongsTo(models.Compania, {
          foreignKey: 'compania_id',
           as: 'compania'
        });
      };
    
      return Catalogo;
    };
    