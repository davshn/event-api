const { Router } = require('express');
const login=require("./login")
const register=require("./register")
const events=require("./events")

const db = require('../db');
const router = Router();

router.use("/login",login)
router.use("/register",register)
router.use("/events",events)



module.exports = router;