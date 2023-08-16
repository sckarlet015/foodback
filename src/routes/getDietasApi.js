//Paquete necesario para acceder a variables de entorno
require('dotenv').config();
// funcion para realizar solicitudes http
const axios = require('axios');
//Modelo
const {
    Diet
} = require('../db');
//Variable de entorno
const api_key = process.env.API_KEY
//Se define la funcion
const getDietasApi = async () => {
    //Cantidad de recetas solicitadas a la api
    const num = 100;
    try {
        //Peticion a la api
        const {
            data
        } = await axios.get(
            `https://api.spoonacular.com/recipes/complexSearch?number=${num}&apiKey=${api_key}&addRecipeInformation=true`
        );
        //Destructuring de la respuesta de la api
        const {
            results
        } = data;
        //Creacion de instancias de Dietas
        const dietsToSave = [];
        // Iterar sobre las recetas y guardar las dietas en un arreglo temporal
        for (const result of results) {
            //Destructuring de las dietas de cada receta
            const {
                diets
            } = result;
            // Iterar sobre las dietas de cada receta y guardarlas en un arreglo temporal
            if (diets && diets.length > 0) {
                for (const diet of diets) {
                    if (!dietsToSave.includes(diet)) {
                        dietsToSave.push(diet);
                    }
                }
            }
        }
        // Array de dietas guardadas en la DB local
        const savedDiets = [];
        // Verificar y guardar las dietas en la base de datos sin repeticiones
        for (const diet of dietsToSave) {
            const savedDiet = await Diet.findOrCreate({
                where: {
                    name: diet
                }
            });
            savedDiets.push(savedDiet);
        }
        // Se retornan las dietas guardadas en la DB por primera ves
        return savedDiets;
    } catch (error) {
        //Si existe un error se consologuea
        console.log(error);
    }
};
//Se exporta la función
module.exports = getDietasApi;