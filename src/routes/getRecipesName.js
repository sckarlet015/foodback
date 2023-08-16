//Paquete necesario para acceder a variables de entorno
require('dotenv').config();
// funcion para realizar solicitudes http
const axios = require('axios');
//Modelos
const {
  Recipe,
  Diet
} = require('../db');
// Objeto con la colección de operadores para consultas y condiciones de busqueda
const {
  Op
} = require('sequelize');
//Variable de entorno
const api_key = process.env.API_KEY
//Se define la función
const getRecipes = async (req, res) => {
  //Destructuring del dato para la consulta
  const {
    name
  } = req.query;
  //Cantidad de recetas solicitadas a la api
  const num = 5;
  try {
    // Buscar recetas en la API por nombre
    const {
      data
    } = await axios.get(
      `https://api.spoonacular.com/recipes/complexSearch?query=${name}&number=${num}&apiKey=${api_key}`
    );
    //Resultado de la consulta
    const {
      results
    } = data;
    // Se crea un arrya con las recetas devueltas por la api
    const recetasAPI = results.map(result => ({
      id: result.id,
      name: result.title,
      image: result.image,
      source: "API",
      diets: result.diets || [],
    }));
    // Buscar recetas en la base de datos local por nombre
    const dbRecipes = await Recipe.findAll({
      where: {
        name: {
          [Op.iLike]: `%${name}%`,
        },
      },
      include: {
        model: Diet,
        attributes: ['name'],
        through: {
          attributes: [],
        },
      },
    });
    // Combinar las recetas encontradas en la base de datos local y las recetas de la API
    const recipes = [...dbRecipes.map(recipe => recipe.toJSON()), ...recetasAPI];
    //S envia la respuesta al cliente
    res.status(200).json(recipes);
  } catch (error) {
    //Si hay un error se envia al cliente
    return res.status(400).json({
      message: error.message
    })
  }
};
//Se exporta la función
module.exports = getRecipes;