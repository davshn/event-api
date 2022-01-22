const { Router } = require("express");
const express = require("express")

const payments = require("./payments")
const forgot = require("./forgot")
const register=require("./register")
const login = require("./login")
const event = require("./event")
const events=require("./events")
const categories = require("./categories")
const country = require("./country-city")
const verify = require("./verify")
const router = Router();

router.use("/stripe", express.raw({ type: "*/*" }));
router.use("/pay",payments)
router.use("/register",register)
router.use("/login",login)
router.use("/event",event)
router.use("/events",events)
router.use("/categories",categories)
router.use("/country-city", country)
router.use("/verify",verify)
router.use("/forgot",forgot)


module.exports = router;