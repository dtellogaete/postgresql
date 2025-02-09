/* Importación de módulos */
const { Sequelize, } = require("sequelize");
require("dotenv").config(); // Cargar variables de entorno

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: "postgres",
  logging: false, // Opcional: deshabilita logs de SQL
  pool: {
    max: 10, // Número máximo de conexiones
    min: 0,
    acquire: 30000, // Tiempo máximo en ms que intentará obtener conexión
    idle: process.env.ALLOW_EXIT_ON_IDLE === "true" ? 10000 : 0, // Tiempo antes de cerrar conexión inactiva
  },
});  


module.exports = sequelize;