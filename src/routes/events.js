const { Router } = require("express");
const { Event } = require("../db")

const router = Router();

router.post('/', async function(req, res) {
    const { id, name, description, 
            place, date, time, creators, 
            price, rating, category, 
            eventPic, eventVid, comment} = req.body;

    let newEvent = await Event.findOrCreate(
        {where:{name: name},
         defaults: {
            id: id,
            description: description,
            place: place,
            date: date,
            time: time,
            creators: creators,
            price: price,
            category: category,
            eventPic: eventPic,
            eventVid: eventVid,
        }}); 
    res.json(newEvent);
});

module.exports = router;