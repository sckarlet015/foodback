const {
  Recipe,
  Diet
} = require('../db');

const postRecipe = async (req, res) => {
  try {
    const {
      name,
      healthScore,
      image,
      steps,
      summary,
      diets
    } = req.body;

    // Verificar que se proporcionen todos los datos necesarios
    if (!name || !healthScore || !steps || !summary || diets.length === 0 || !image) {
      return res.status(400).json({
        message: 'Faltan datos por completar',
        name,
        healthScore,
        steps,
        summary,
        diets,
        image
      });
    }

    // Verificar que los valores numéricos sean números válidos
    if (isNaN(healthScore)) {
      return res.status(400).json({
        message: 'El nivel de salud debe ser números válidos'
      });
    }

    // Verificar si ya existe una receta con el mismo nombre
    const existingRecipe = await Recipe.findOne({
      where: {
        name: name,
      },
    });

    if (existingRecipe) {
      return res.status(409).json({
        message: 'Ya existe una receta con el mismo nombre',
      });
    }

    // Guardar la receta en la DB local
    const recipe = await Recipe.create({
      name,
      healthScore,
      image,
      steps,
      summary
    });

    for (const diet of diets) {
      const dieta = await Diet.findOne({
        where: {
          name: diet
        }
      });
      if (dieta) await recipe.addDiet(dieta);
    }
    //Crear un objeto con la informacion nesesaria para la respuesta del cliente
    const newRecipe = recipe.toJSON();
    let responseRecipe = {
      name: newRecipe.name,
      image: newRecipe.image,
      summary: newRecipe.summary,
      healthScore: newRecipe.healthScore,
      steps: newRecipe.steps,
      apiID: newRecipe.id,
      id: newRecipe.id,
      source: newRecipe.source,
      diets
    }

    return res.status(200).json(responseRecipe);
  } catch (error) {
    return res.status(404).json({
      message: error.message
    });
  }
};

module.exports = postRecipe;