'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.js')[env];

// Inicializar sequelize
let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// Cargar los modelos
const db = {};

// Importar modelos explícitos
const Compania = require('./compania_model')(sequelize, Sequelize.DataTypes);
const Catalogo = require('./catalogo_model')(sequelize, Sequelize.DataTypes);
const Empleado = require('./empleado_model')(sequelize, Sequelize.DataTypes);
const Producto = require('./producto_model')(sequelize, Sequelize.DataTypes);
const HistorialPrecio = require('./historial_precio_model')(sequelize, Sequelize.DataTypes);
const Categoria = require('./categoria_model')(sequelize, Sequelize.DataTypes);
const Roles = require('./roles_model')(sequelize, Sequelize.DataTypes); 
const MetodoPago = require('./metodo_pago_model')(sequelize, Sequelize.DataTypes);
const Cliente = require('./cliente_model')(sequelize, Sequelize.DataTypes);



// Agregar los modelos al objeto db
db.Compania = Compania;
db.Catalogo = Catalogo;
db.Empleado = Empleado;
db.Producto = Producto;
db.HistorialPrecio = HistorialPrecio;
db.Categoria = Categoria;
db.Roles = Roles; 
db.MetodoPago = MetodoPago;
db.Cliente = Cliente;


// Cargar los demás modelos desde archivos en la carpeta
fs
  .readdirSync(__dirname)
  .filter(file => file.endsWith('_model.js'))
  .forEach(file => {
    // Cada uno de estos archivos exporta (sequelize, DataTypes) => Model
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  })

// Definir las asociaciones
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Establecer las propiedades sequelize y Sequelize
db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Verificar conexión a la base de datos
sequelize.authenticate()
  .then(() => {
    console.log('Conexión a la base de datos establecida con éxito.');
  })
  .catch(err => {
    console.error('No se pudo conectar a la base de datos:', err);
  });

module.exports = db;
