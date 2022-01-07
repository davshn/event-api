const { Router } = require("express");
const { User } = require("../db.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = Router();

const {
    TOKEN_KEY
  } = process.env;

router.post("/", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(req.body);
    if (!(email && password)) {
      res.status(400).send("All input is required");
    }

    const user = await User.findOne({ where: { email }});

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );
      
      user.token = token;
      const loggedUser = {
        token: user.token,
        id: user.id,
        name: user.name,
        interests: user.interests
      }
      
      res.status(200).json(loggedUser);
    } else {
      res.status(402).send("El usuario no existe");
    }
  } catch (error) {
    res.status(405).send("Error en el login");
  }
});

module.exports = router;
