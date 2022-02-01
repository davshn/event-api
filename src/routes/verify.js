const { Router } = require("express");
const { User } = require("../db.js");
const router = Router();

router.get("/",  async (req, res) => {

  try {
    const email = req.query.mail.toLowerCase();
    const verificationId = req.query.id;
    const user = await User.findOne({ where: { email } });
    
    if (user.verificationCode === verificationId) {
      await User.update({ verifyProfile: true }, { where: { email } });
      res.status(200).send("Tu usuario ha sido verificado. Diviértete en findSpot");
    }
    
    else res.status(404).send("Upps... no hemos podido encontrar a tu usuario.");
    
  } catch (error) {
    res.status(400).send("Error en la verificacion");
  }
});

module.exports = router;
