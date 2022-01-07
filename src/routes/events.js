const { Router } = require("express");
const { Event , User} = require("../db")


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

const cardEvent = async()=>{
    const event = await Event.findAll()
    const cards = event.map(el =>{ 
        return{
            id: el.id,
            name: el.name,
            eventPic: el.eventPic,
            date: el.date,
            time: el.time,
            price: el.price
        }
    })
    return cards;
}
router.get('/', async(req,res)=>{
    const allCards = await cardEvent();
    res.status(200).send(allCards);

})


module.exports = router;