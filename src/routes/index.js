const {
    Router
} = require('express');
const getRecipeId = require('./getRecipeId');
const getDiets = require('./getDiets')
const getRecipeByName = require('./getRecipesName');
const getRecetasApi = require('./getRecetasApi');
const postRecipe = require('./postRecipe')

// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');


const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);
router.get("/recipes", getRecetasApi)
router.get("/recipes/name", getRecipeByName)
router.get("/recipes/:idRecipe", getRecipeId)
router.post("/recipes", postRecipe)
router.get("/diets", getDiets)


module.exports = router;