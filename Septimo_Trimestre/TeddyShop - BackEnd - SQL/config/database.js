require('dotenv').config();
const { Sequelize } = require('sequelize');
const config = require('./config')[process.env.NODE_ENV || 'development'];

const sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  port: config.port,
  dialect: config.dialect,
  dialectOptions: config.dialectOptions, 
  define: config.define,
  logging: config.logging,
  pool: config.pool || undefined
});

sequelize.authenticate()
  .then(() => {
    console.log('Conexión exitosa a la base de datos');
  })
  .catch((error) => {
    console.error('No se pudo conectar a la base de datos:', error);
  });

console.log('Configuración de la base de datos:', {
  database: config.database,
  username: config.username,
  host: config.host,
  dialect: config.dialect
});

module.exports = sequelize;
