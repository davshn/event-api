const { Router } = require("express");
const { Category } = require("../db.js");
const auth = require("../Middleware/auth");
const router = Router();

router.get("/", auth, async (req, res) => {

  try {
  let category=["Karaoke","Fiesta","Deporte","After","Concierto","Cultural","Gastronomía"]
  let data=category.map(async (c)=>{await Category.findOrCreate({where:{name:c}})})
  console.log(data)
  const allCategories= await Category.findAll()
    res.status(200).send(allCategories);
  } catch (error) {
    res.status(400).send("Error en la carga de categorias");
  }
});

module.exports = router;
