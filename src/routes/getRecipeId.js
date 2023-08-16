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
const getRecipeId = async (req, res) => {
    //Destructuring del dato para la consulta
    const {
        idRecipe
    } = req.params;

    // Validar si idRecipe es un número entero
    if (!isNaN(idRecipe)) {
        try {
            const {
                data
            } = await axios.get(
                `https://api.spoonacular.com/recipes/${idRecipe}/information?apiKey=${api_key}&addRecipeInformation=true`
            );
            // Crear objeto de receta de la API parecido al modelo
            const apiRecipe = {
                name: data.title,
                image: data.image,
                summary: data.summary,
                healthScore: data.healthScore,
                steps: data.instructions || 'No se proporcionaron instrucciones para esta receta',
                apiID: data.id,
                source: 'API',
                diets: data.diets || [], // Obtener las dietas de la receta de la API
            };
            // Guardar las dietas que no existan en un array
            const dietsToSave = [];
            for (const diet of apiRecipe.diets) {
                const existingDiet = await Diet.findOne({
                    where: {
                        name: diet
                    }
                });
                if (!existingDiet) {
                    dietsToSave.push({
                        name: diet
                    });
                }
            }
            // Guardar las dietas en la base de datos local
            await Diet.bulkCreate(dietsToSave);
            //Respuesta al cliente
            res.status(200).json(apiRecipe)
        } catch (error) {
            //Si hay un error se envia al cliente
            return res.status(400).json({
                message: error.message
            })
        }
    } else {
        // Buscar la receta en la base de datos local por id
        const localRecipe = await Recipe.findOne({
            //Aquí se establece la condición de búsqueda de la consulta
            where: {
                id: idRecipe,
            },
            include: {
                model: Diet,
                attributes: ['name'],
                through: {
                    attributes: [],
                },
            },
        });
        //Crear un objeto con la informacion nesesaria para la respuesta del cliente
        let newRecipe = {
            name: localRecipe.name,
            image: localRecipe.image,
            summary: localRecipe.summary,
            healthScore: localRecipe.healthScore,
            steps: localRecipe.steps || 'No se proporcionaron instrucciones para esta receta',
            apiID: localRecipe.id,
            source: localRecipe.source,
            diets: localRecipe.diets.map(dieta => dieta.name),
        }
        //Respuesta al cliente
        res.status(200).json(newRecipe)
    }
};
module.exports = getRecipeId;