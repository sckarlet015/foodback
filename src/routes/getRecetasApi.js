//Paquete necesario para acceder a variables de entorno
require('dotenv').config();
//Funcion para realizar consultas http
const axios = require('axios');
//Modelos
const {
    Recipe,
    Diet
} = require('../db');
//Variable de entorno
const api_key = process.env.API_KEY
//Se define la función
const getRecetasApi = async (req, res) => {
    //Cantidad de recetas solicitadas a la api
    const num = 100;
    try {
        //Se consulta la api
        const {
            data
        } = await axios.get(
            `https://api.spoonacular.com/recipes/complexSearch?number=${num}&apiKey=${api_key}&addRecipeInformation=true`
        );
        //Se destructura
        const {
            results
        } = data;
        //Array con los datos que se enviaran al cliente obtenidos de la api
        const recetasAPI = results.map(result => ({
            id: result.id,
            name: result.title,
            image: result.image,
            source: "API",
            diets: result.diets || [],
        }));
        //Se consulta en la DB local las recetas existentes y se guardan en un array
        const recetasDB = await Recipe.findAll({
            //Se especifican los atributos de las recetas que se desean incluir en el resultado de la consulta
            attributes: ['id', 'name', 'image', 'source'],
            //Esta parte indica que se debe incluir una asociación de la receta con el modelo "Diet" en la consulta
            include: {
                //Se establece que solo se incluya el atributo "name" de cada dieta
                model: Diet,
                attributes: ['name'],
                //Se indica que no se incluya ninguna atributo adicional de la tabla intermedia
                through: {
                    attributes: [],
                },
            },
        });
        //Se guarda en un array los datos de las recetas existentes en la DB y de la respuesta de api
        const allRecetas = [
            ...recetasAPI,
            ...recetasDB.map(recipe => ({
                //Se establecen solo los datos necesarios para la respuesta al cliente
                id: recipe.id,
                name: recipe.name,
                image: recipe.image,
                source: recipe.source,
                diets: recipe.diets.map(diet => diet.name),
            })),
        ];
        //Se envían los datos al cliente
        res.status(200).json(allRecetas)
    } catch (error) {
        //Si hay un error se envia al cliente
        return res.status(400).json({
            message: error.message
        })
    }
};
//Se exporta la función
module.exports = getRecetasApi;