/* Importar modulos */
const { DataTypes } = require("sequelize");
const sequelize = require('./db.js')

/* Directors */
const Directors = sequelize.define("directors", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false, // El nombre es obligatorio
  },
  birthdate: {
    type: DataTypes.DATEONLY, // Solo la fecha sin hora
    allowNull: true, // Puede ser opcional
  },
  nationality: {
    type: DataTypes.STRING,
    allowNull: true, // Puede ser opcional
  }
},
  {
    timestamps: false
  }
);

/* Movies */
const Movies = sequelize.define("movies", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false, // Título obligatorio
  },
  release_year: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  director_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Directors, // Relación con Directors
      key: "id",
    },
    onUpdate: "CASCADE", // Si cambia el ID del director, se actualiza aquí
    onDelete: "CASCADE", // Si se elimina el director, se eliminan sus películas
  },
}, {
  timestamps: false, // Deshabilita createdAt and updatedAt
});

// Definir la relación con Directors
Directors.hasMany(Movies, { foreignKey: "director_id" });
Movies.belongsTo(Directors, { foreignKey: "director_id" });

module.exports = { Directors, Movies };
