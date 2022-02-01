const { Router } = require("express");
const { User, Category } = require("../db.js");
const bcrypt = require("bcrypt");
const router = Router();
const searchCategory = require("./controls");
const transporter = require("../Middleware/nodeMailer");
const auth = require("../Middleware/auth");



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
      subject: "Verifica tu cuenta de findSpot",
      text: "Verifica tu cuenta de findSpot",
      //html: `<br> Haz click aqui para verificar tu cuenta<br/> <a href="https://find-spot.herokuapp.com/verify?id=${newUser.verificationCode}&mail=${newUser.email}" >Verificar</a>`,
          
      html: `
            <h3>Bienvenid@ a la comunidad findSpot, ${newUser.name}.</h3>
            <p>Somos una app con un objetivo claro, conectar personas con experiencias únicas.</p>
            <p>Ya puedes ingresar y disfrutar de todos los eventos que tenemos para vos.</p>
            <span>Si quieres verificar tu cuenta, puedes hacer click en el siguiente <span/>
            <a href="https://find-spot.herokuapp.com/verify?id=${newUser.verificationCode}&mail=${newUser.email}" >link</a>
            <br></br>
            <h4> Muchas gracias por elegirnos,</h4>
            <h4> Equipo de findSpot <img src="https://res.cloudinary.com/findspot/image/upload/v1643746281/logo_ckx5h2.png" alt="Logo not Found" width="18" height="18"></h4>
            
      `
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

router.post("/updateUser",auth, async (req, res) => {
  try {
    const idUser = req.body.id;

    const userUpdate = await User.findOne({ where: { id: idUser } });
    const salt = await bcrypt.genSalt(10);
    if (userUpdate) {
      await userUpdate.set({
        name: req.body.name,
        profilePic: req.body.profilePic,
        password: await bcrypt.hash(req.body.password, salt),
      });

      await userUpdate.save();

      res.status(200).send("Usuario Editado");
    } else res.status(404).send("Usuario no encontrado");
  } catch (error) {
    res.status(400).send("Error al editar el usuario");
  }
});

const getUsers = async () => {
  try {
    const users = await User.findAll({ include: Category });
    const ordered = users.map((el) => {
      return {
        id: el.id,
        name: el.name,
        dateOfBirth: el.dateOfBirth,
        profilePic: el.profilePic,
        email: el.email,
        categories: el.categories.map((c) => c.name),
      };
    });
    return ordered;
  } catch (error) {
    console.log(error);
  }
};

router.get("/users", async (req, res) => {
  const allUsers = await getUsers();
  res.status(200).send(allUsers);
});

module.exports = router;
