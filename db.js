/* Importación de módulos */

const { Pool } = require('pg');  // Importa Pool para manejar conexiones a PostgreSQL
const format = require('format'); // Importat format
const { query } = require('express');
require('dotenv').config(); // Carga variables de entorno desde .env

/* Configuración de la conexión */
const config = {
    host: process.env.DB_HOST,      
    port: process.env.DB_PORT,     
    user: process.env.DB_USER,      
    password: process.env.DB_PASSWORD, 
    database: process.env.DB_NAME,  
    allowExitOnIdle: process.env.ALLOW_EXIT_ON_IDLE === 'true', 
};
  
/* Creación del Pool */
const pool = new Pool(config);

/* Verificando la conexión */
pool.connect((err, client, done) => {
    if (err) {
      console.error('Error al conectar a la base de datos:', err);
    } else {
      console.log('Conexión exitosa a la base de datos');
      done(); // Liberar cliente de la pool
    }
});

/* Get Movies */
const getMovies = async ({ limit = 10, order_by = "id_ASC", page = 0 }) => {
    let client;
    try {
        const offset = page * limit;
        const [field, direction] = order_by.split('_');

        if (!["ASC", "DESC"].includes(direction.toUpperCase())) {
            throw new Error("Orden inválido. Usa 'ASC' o 'DESC'.");
        }

        const query = `SELECT * FROM movies ORDER BY ${field} ${direction} LIMIT $1 OFFSET $2`;
        const values = [limit, offset];

        // Obtener conexión del pool
        client = await pool.connect();
        const { rows: movies } = await client.query(query, values);
        return movies;
    } catch (error) {
        console.error("Error en getMovies:", error.message);
        return [];
    } finally {
        if (client) client.release(); // Liberar la conexión al pool
    }
};


const testPoolConnection = async () => {
    console.time("Pooling"); // Inicia el contador

    const queries = [];
    for (let i = 0; i < 5; i++) { // Ejecutar 5 consultas simultáneas
        queries.push(pool.query('SELECT pg_sleep(1)')); // Simula consulta lenta
    }

    await Promise.all(queries);
    await pool.end();

    console.timeEnd("Pooling"); // Finaliza el contador
};

module.exports = { getMovies, testPoolConnection};
