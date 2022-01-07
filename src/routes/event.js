const { Router } = require("express");
const { Event } = require("../db")

const router = Router();

router.get('/:eventId', async function(req, res) {
    const eventId = req.params.eventId;
    const event = await Event.findAll({where:{id:eventId}});

    event
    ?res.json(event)
    :res.json({message: "No event found for that id"});
});

module.exports = router;