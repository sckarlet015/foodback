//Modelo de dietas
const {
  Diet
} = require("../db.js")
//Se define la función
const getDiets = async (req, res) => {
  try {
    //Se hace la petición y se guarda en el arrya dietas
    const dietas = await Diet.findAll();
    //Se envia el resultado al cliente
    res.status(200).json(dietas)
  } catch (error) {
    //Si hay algún error se envia al cliente
    return res.status(400).json({
      message: error.message
    })
  }
}
module.exports = getDiets;