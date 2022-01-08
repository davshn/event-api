const { Router } = require("express");

const register=require("./register")
const login = require("./login")
const event = require("./event")
const events=require("./events")
const categories = require("./categories")
const country= require("./country-city")
const router = Router();


router.use("/register",register)
router.use("/login",login)
router.use("/event",event)
router.use("/events",events)
router.use("/categories",categories)
router.use("/country-city",country)


module.exports = router;