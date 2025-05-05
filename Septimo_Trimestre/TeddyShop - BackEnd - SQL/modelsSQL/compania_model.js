module.exports = (sequelize, DataTypes) => {
  const Compania = sequelize.define('Compania', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    NIT: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      field: 'nit' 
    },    
    telefonoEmpresa: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'telefonoempresa' 
    },
    nombreEmpresa: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'nombreempresa'
    },
    direccionEmpresa: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'direccionempresa'
    }
  }, {
    tableName: 'compania',
    timestamps: true, 
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    underscored: true
  });

  // Asociaciones
  Compania.associate = (models) => {
    Compania.hasMany(models.Empleado, {
      foreignKey: 'compania_id',
      as: 'empleados'
    });

    Compania.hasMany(models.Catalogo, {
      foreignKey: 'compania_id',
      as: 'catalogos'
    });
  };

  return Compania;
};