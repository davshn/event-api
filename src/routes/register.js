const { Router } = require("express");
const { User } = require("../db.js");
const bcrypt = require("bcrypt");
const router = Router();
const ApiKey = require ("../emailJS")
const emailJS = require ("@emailjs/browser")

router.post("/", async (req, res) => {
  const salt = await bcrypt.genSalt(10);
  const data = {name:req.body.name,email:req.body.email}
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
    emailJS.send(ApiKey.SERVICE_ID, ApiKey.TEMPLATE_ID, data, ApiKey.USER_ID)
            .then((result) => {console.log(result.text);}, 
            (error) => {console.log(error.text);})

    res.status(200).send("Usuario creado con éxito!");
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
