const { Router } = require("express");
const { User } = require("../db.js");
const router = Router();

router.get("/",  async (req, res) => {

  try {
    const email = req.query.mail.toLowerCase();
    const verificationId = req.query.id;
    const user = await User.findOne({ where: { email } });
    
    if (user.verificationCode === verificationId) {
      console.log("Usuario encontrado")
      await User.update({ where: { email }, user: { verifyProfile: true } });
      res.status(200).send("Usuario Verificado");
    }
    
    else res.status(404).send("Usuario no encontrado");
    
  } catch (error) {
    res.status(400).send("Error en la verificacion");
  }
});

module.exports = router;
