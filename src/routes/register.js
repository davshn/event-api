const { Router } = require("express");
const { User, Category } = require("../db.js");
const bcrypt = require("bcrypt");
const router = Router();

async function searchCategory (category){
  try{
    const categories= await Category.findAll({
      where:{name:category}
    })
    return categories;
  }
  catch(e){   
    console.log(e);
  }
};

router.post("/", async (req, res) => {
  const salt = await bcrypt.genSalt(10);
  try{
    const categories= await searchCategory(req.body.interests);
    const newUser= await User.create({
      dateOfBirth: req.body.dateOfBirth,
      name: req.body.name,
      profilePic: req.body.profilePic,
      email: req.body.email.toLowerCase(),
      verifyProfile: req.body.verifyProfile,
      termsAndconditions: req.body.termsAndconditions,
      password: await bcrypt.hash(req.body.password, salt),
    })
    newUser.addCategory(categories)

    res.status(200).send("Usuario creado con éxito!");
  } catch (error) {
    res.status(400).send("Error en la creación del usuario");
  }
});

module.exports = router;
