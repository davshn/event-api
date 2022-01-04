const { Router } = require('express');
const { API_KEY } = process.env;
const axios = require('axios');
const { Event } = require('../db');
const db = require('../db');


const router = Router();
module.exports = router;