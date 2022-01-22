const { Router } = require("express");
const express = require("express")
const Tickets = require("./tickets")
const payments = require("./payments")
const register=require("./register")
const login = require("./login")
const event = require("./event")
const events=require("./events")
const categories = require("./categories")
const country = require("./country-city")
const verify = require("./verify")
const router = Router();

router.use("/stripe", express.raw({ type: "*/*" }));

router.use("/infoTicket",Tickets)

router.use("/pay",payments)
router.use("/register",register)
router.use("/login",login)
router.use("/event",event)
router.use("/events",events)
router.use("/categories",categories)
router.use("/country-city", country)
router.use("/verify",verify)


module.exports = router;