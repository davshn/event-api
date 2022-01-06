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

    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign(
        { id: user.id, email: user.email },
        TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );

      user.token = token;
     
      res.status(200).json(token);
    } else {
      res.status(400).send("El usuario no existe");
    }
  } catch (error) {
    res.status(400).send("Error en el login");
  }
});

module.exports = router;
