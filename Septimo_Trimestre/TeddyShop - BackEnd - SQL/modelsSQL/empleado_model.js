module.exports = (sequelize, DataTypes) => {
    const Empleado = sequelize.define('Empleado', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      dniEmpleado: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        field: 'dniempleado'
      },
      telefonoEmpleado: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'telefonoempleado'
      },
      nombreEmpleado: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'nombreempleado'
      }
    }, {
      tableName: 'empleado',
      timestamps: false
    });
  
    Empleado.associate = (models) => {
      Empleado.belongsTo(models.Compania, {
        foreignKey: 'companiaId',
        as: 'compania'
      });
      
    };
  
    return Empleado;
  };
  