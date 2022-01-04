const { Router } = require("express");

const register=require("./register")
const login=require("./login")
const events=require("./events")
const router = Router();


router.use("/register",register)
router.use("/login",login)
router.use("/events",events)






module.exports = router;
