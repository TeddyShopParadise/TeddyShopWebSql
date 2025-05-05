const { DataTypes } = require('sequelize'); // Asegúrate de importar DataTypes

module.exports = (sequelize) => {
  const Roles = sequelize.define('Roles', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    estado: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: 'roles',
    timestamps: false
  });

  // Relación con Usuario: un rol puede tener muchos usuarios
  Roles.associate = (models) => {
    Roles.hasMany(models.Usuario, {
      foreignKey: 'rol_id',
      as: 'usuarios'
    });
  };

  return Roles;
};
