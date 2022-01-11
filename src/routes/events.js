const { Router } = require("express");
const { Event , User,Category} = require("../db")


const router = Router();

router.post('/', async function(req, res) {
    const { name, description, 
            place, date, time, creators, 
            price, rating, category, 
            eventPic, eventVid, comment} = req.body;
    try {
        let newEvent = await Event.create({
                name,
                description,
                place,
                date,
                time,
                creators,
                price,
                category,
                eventPic,
                eventVid,
            }); 
        res.json(newEvent);
    } catch (error) {
        res.json(error);
    }

});

const cardEvent = async()=>{
    const event = await Event.findAll({ include: Category })
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