const express = require("express");
const { Movies, Directors } = require("./models");
const sequelize = require("./db.js"); // Asegúrate de que db.js exporta `sequelize`

const app = express();

const PORT = 3000;

app.use(express.json()); // Middleware para permitir JSON en req.body


const conectarDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Conexión a la base de datos exitosa.");
  } catch (error) {
    console.error("Error al conectar a la base de datos:", error);
  }
};
conectarDB();

// Crear una película
app.post("/movies", async (req, res) => {
  try {
    const { title, release_year, director_id } = req.body;

    // Verificar si el director existe
    const director = await Directors.findByPk(director_id);
    if (!director) return res.status(404).json({ error: "Director no encontrado" });

    const movie = await Movies.create({ title, release_year, director_id });
    res.status(201).json(movie);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener todas las películas con su director
app.get("/movies", async (req, res) => {
  try {
    const movies = await Movies.findAll({ include: Directors });
    res.json(movies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener una película por ID
app.get("/movies/:id", async (req, res) => {
  try {
    const movie = await Movies.findByPk(req.params.id, { include: Directors });
    if (!movie) return res.status(404).json({ error: "Película no encontrada" });
    res.json(movie);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar una película
app.put("/movies/:id", async (req, res) => {
  try {
    const movie = await Movies.findByPk(req.params.id);
    if (!movie) return res.status(404).json({ error: "Película no encontrada" });
    await movie.update(req.body);
    res.json(movie);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Eliminar una película
app.delete("/movies/:id", async (req, res) => {
  try {
    const movie = await Movies.findByPk(req.params.id);
    if (!movie) return res.status(404).json({ error: "Película no encontrada" });

    await movie.destroy();
    res.json({ message: "Película eliminada" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Iniciar el servidor en el puerto 3000
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
