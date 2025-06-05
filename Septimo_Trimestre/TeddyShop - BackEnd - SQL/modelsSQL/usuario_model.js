const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Usuario = sequelize.define('Usuario', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    contrasena: {
      type: DataTypes.STRING,
      allowNull: false
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    estado: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: 'usuario',
    timestamps: false
  });

  Usuario.associate = (models) => {
    Usuario.belongsTo(models.Empleado, {
      foreignKey: {
        name: 'empleado_id',
        allowNull: true 
      },
      as: 'empleado'
    });

    Usuario.belongsTo(models.Roles, {
      foreignKey: {
        name: 'rol_id',
        allowNull: true
      },
      as: 'rol'
    });
  };

  return Usuario;
};
