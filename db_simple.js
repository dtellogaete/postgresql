/* Importación de módulos */
const { Client } = require('pg');  // Importa Client
require('dotenv').config(); // Carga variables de entorno desde .env

/* Configuración de la conexión */
const config = {
    host: process.env.DB_HOST,      
    port: process.env.DB_PORT,     
    user: process.env.DB_USER,      
    password: process.env.DB_PASSWORD, 
    database: process.env.DB_NAME,  
};

/* Crear la conexión */
const client = new Client(config);

/* Verificando la conexión */
client.connect((err) => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err.stack);
    } else {
        console.log('Conexión exitosa a la base de datos');
    }
});

/* Test Conexión Simple */
const testSingleConnection = async () => {
    console.time("Conexión Simple"); // Inicia el contador de tiempo

    const client = new Client(config);
    await client.connect();

    const queries = [];
    for (let i = 0; i < 5; i++) { // Ejecutar 5 queries simultáneas
        queries.push(client.query('SELECT pg_sleep(1)')); // Crea un delay en la query
    }

    await Promise.all(queries);
    await client.end();

    console.timeEnd("Conexión Simple"); // Finaliza el contador
};


module.exports = { testSingleConnection };
