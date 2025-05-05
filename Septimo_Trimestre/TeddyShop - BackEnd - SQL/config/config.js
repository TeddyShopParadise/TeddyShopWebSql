require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "P3luch35.0s0",
    database: process.env.DB_NAME || "Peluches.oso",  
    host: process.env.DB_HOST || "127.0.0.1",
    port: process.env.DB_PORT || 5432,
    dialect: "postgres",
    define: {
      underscored: true, 
      freezeTableName: true, 
      timestamps: true
    },
    dialectOptions: {
      quoteIdentifiers: true,
      ssl: process.env.DB_SSL === 'true' ? { require: true, rejectUnauthorized: false } : false 
    },
    logging: process.env.NODE_ENV === 'development' ? console.log : false
  },
  test: {
    username: process.env.DB_TEST_USER || "postgres",
    password: process.env.DB_TEST_PASSWORD || "P3luch35.0s0",
    database: process.env.DB_TEST_NAME || "Peluches.oso_test",
    host: process.env.DB_TEST_HOST || "127.0.0.1",
    port: process.env.DB_PORT || 5432,
    dialect: "postgres",
    dialectOptions: {
      quoteIdentifiers: true
    },
    logging: false
  },
  production: {
    username: process.env.DB_PROD_USER || "postgres",
    password: process.env.DB_PROD_PASSWORD || "P3luch35.0s0",
    database: process.env.DB_PROD_NAME || "Peluches.oso_prod", 
    host: process.env.DB_PROD_HOST || "127.0.0.1",
    port: process.env.DB_PORT || 5432,
    dialect: "postgres",
    dialectOptions: {
      quoteIdentifiers: true,
      ssl: process.env.DB_SSL === 'true' ? { require: true, rejectUnauthorized: false } : false
    },
    logging: false,
    pool: {
      max: parseInt(process.env.DB_POOL_MAX) || 5,
      min: parseInt(process.env.DB_POOL_MIN) || 0,
      acquire: parseInt(process.env.DB_POOL_ACQUIRE) || 30000,
      idle: parseInt(process.env.DB_POOL_IDLE) || 10000
    }
  }
};
