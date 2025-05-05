module.exports = (sequelize, DataTypes) => {
  const HistorialPrecio = sequelize.define('HistorialPrecio', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    precio: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    fechaInicio: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'fechainicio'
    },
    fechaFin: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'fechafin'
    },
    estadoPrecio: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      field: 'estadoprecio'
    }
  }, {
    tableName: 'historialprecio',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });



  return HistorialPrecio;
};
