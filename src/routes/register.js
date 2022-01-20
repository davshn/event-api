const { Router } = require("express");
const { User } = require("../db.js");
const bcrypt = require("bcrypt");
const router = Router();
const searchCategory = require("./controls");
const transporter = require("../Middleware/nodeMailer");

router.post("/", async (req, res) => {
  const salt = await bcrypt.genSalt(10);
  try {
    const categories = await searchCategory(req.body.interests);
    const newUser = await User.create({
      dateOfBirth: req.body.dateOfBirth,
      name: req.body.name,
      profilePic: req.body.profilePic,
      email: req.body.email.toLowerCase(),
      password: await bcrypt.hash(req.body.password, salt),
    });
    newUser.addCategory(categories);

    const mailData = {
      from: "find.spot.ar.co@gmail.com", // sender address
      to: newUser.email, // list of receivers
      subject: "Verifica tu cuenta",
      text: "Verifica tu cuenta",
      html: `<br> Haz click aqui para verificar tu cuenta<br/> <a href="https://find-spot.herokuapp.com/verify?id=${newUser.verificationCode}&mail=${newUser.email}" >Verificar</a>`,
    };

    transporter.sendMail(mailData, function (err, info) {
      if (err) console.log("No enviado");
      else console.log("Enviado");
    });

    res.status(200).send("Usuario creado con éxito!");
  } catch (error) {
    res.status(400).send("Error en la creación del usuario");
  }
});

router.get("/updateUser", async (req, res) => {
  try {
    const id = req.body.id;

    const userUpdate = await User.findOne({ where: { id: id } });

    if (userUpdate) {
      await userUpdate.set({
        name: req.body.name,
      });

      await userUpdate.save();

      res.status(200).send("Usuario Editado");
    } else res.status(404).send("Usuario no encontrado");
  } catch (error) {
    res.status(400).send("Error al editar el usuario");
  }
});

module.exports = router;
