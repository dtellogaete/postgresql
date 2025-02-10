/* Importación de módulos */
const express = require('express');
const cors = require('cors');

/* Import DB*/
const { getMovies } = require('./db.js');
const { testPoolConnection } = require('./db.js');
const { testSingleConnection } = require('./db_simple.js')

/* Configuración de servidor */
const app = express();
app.use(cors());
app.use(express.json());

/* Levantando el Servidor */
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto: ${PORT}`);
});

/* Endpoints*/
app.get('/', (req, res) => {
    res.send('Conexión a Postgresql');
});

app.get('/movies', async (req, res) => {
    try {
      const movies = await getMovies(req.query);
  
      res.status(200).json({
        totalMovies: movies.length,
        movies: movies.map(movie => ({
          title: movie.title,
          releaseYear: movie.release_year,          
        })),
      });
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
});

app.get('/test-simple', async (req, res) => {
    try {
        await testSingleConnection();
        res.send('Consulta con conexión simple completada');
    } catch (error) {
        console.error('Error en test-single:', error);
        res.status(500).send('Error en la consulta');
    }
});

app.get('/test-pool', async (req, res) => {
    try {
        await testPoolConnection();
        res.send('Consulta con Pooling completada');
    } catch (error) {
        console.error('Error en test-pool:', error);
        res.status(500).send('Error en la consulta');
    }
});
  