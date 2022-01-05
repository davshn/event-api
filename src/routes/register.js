const { Router } = require("express");
const { User } = require("../db.js");
const bcrypt = require("bcrypt");
const router = Router();

router.post("/", async (req, res) => {
  const salt = await bcrypt.genSalt(10);
  try {
    const user = {
      dateOfBirth: req.body.dateOfBirth,
      name: req.body.name,
      profilePic: req.body.profilePic,
      email: req.body.email,
      verifyProfile: req.body.verifyProfile,
      interests: req.body.interests,
      termsAndconditions: req.body.termsAndconditions,
      password: await bcrypt.hash(req.body.password, salt),
    };

    const created_user = await User.create(user);
    res.status(200).send("Usuario creado con éxito!");
  } catch (error) {
    res.status(400).send("Error en la creación del usuario");
  }
});

module.exports = router;
