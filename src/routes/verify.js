const { Router } = require("express");
const { Category } = require("../db.js");
const router = Router();

router.get("/",  async (req, res) => {

  try {
  console.log(req.query)
  } catch (error) {
    res.status(400).send("Error en la carga de categorias");
  }
});

module.exports = router;
