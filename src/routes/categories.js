const { Router } = require("express");
const { Category } = require("../db.js");
const router = Router();

router.get("/", async (req, res) => {
  try {
    let cat = ["Karaoke", "Fiesta"];
    let data = cat.map(async (g) => {
      await Category.findOrCreate({ where: { name: g } });
    });
    const allCategories = await Category.findAll();
    res.status(200).send(allCategories);
  } catch (error) {
    res.status(400).send("Error en la carga de las categorias");
  }
});

module.exports = router;
