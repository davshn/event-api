const { Router } = require("express");
const { User } = require("../db.js");
const router = Router();
const transporter = require("../Middleware/nodeMailer");
const bcrypt = require("bcrypt");

router.post("/", async (req, res) => {
  try {
    const email = req.body.email.toLowerCase();
    const userUpdate = await User.findOne({ where: { email: email } });

    const mailData = {
      from: "find.spot.ar.co@gmail.com", // sender address
      to: userUpdate.email, // list of receivers
      subject: "Recupera tu contraseña",
      text: "Recupera tu contraseña",
      html: `<br>Haz click para recuperar tu contraseña<br/> <a href="https://find-spot.herokuapp.com/forgot/verify?id=${userUpdate.verificationCode}&user=${userUpdate.id}" >Recuperar contraseña</a>`,
    };

    transporter.sendMail(mailData, function (err, info) {
      if (err) console.log("No enviado");
      else console.log("Enviado");
    });

    res.status(200).send("Recuperación de contraseña");
  } catch (error) {
    res.status(400).send("Error en la recuperación de contraseña");
  }
});

router.get("/verify", async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const id = req.query.user;
    const verificationId = req.query.id;
    const user = await User.findOne({ where: { id } });

    if (user.verificationCode === verificationId) {
      const randomPassword = Math.floor(Math.random() * 10000000).toString()
 
      const hash= await bcrypt.hash(randomPassword, salt)
      console.log(hash)
      await User.update(
        { password:hash  },
        { where: { id } }
      );

      res
        .status(200)
        .send(
          `Tu nueva contraseña es ${randomPassword}.No olvides modificarla en la sección 'Para ti' `
        );
    } else res.status(404).send("Usuario no encontrado");
  } catch (error) {
    res.status(400).send("Error en la verificacion");
  }
});

module.exports = router;
