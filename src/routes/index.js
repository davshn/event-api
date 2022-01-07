const { Router } = require("express");

const register=require("./register")
const login=require("./login")
const events=require("./events")
const categories=require("./categories")
const router = Router();


router.use("/register",register)
router.use("/login",login)
router.use("/events",events)
router.use("/categories",categories)

router.use("/country-city",categories)



module.exports = router;
