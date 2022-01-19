const { Router } = require("express");
const { Event } = require("../db");
const { Op } = require("sequelize");
const searchCategory = require("./controls");

const router = Router();

router.post("/", async function (req, res) {
  const {
    name,
    description,
    place,
    date,
    time,
    creators,
    price,
    rating,
    category,
    eventPic,
    eventVid,
    comment,
    longitude,
    latitude
  } = req.body;
  try {
    const categories= await searchCategory(category)
    const newEvent = await Event.findOrCreate(
      {where:{
        name:name, date: date, time: time
      },
      defaults:{
        description,
        place,
        price,
        eventPic,
        eventVid,
        longitude,
        latitude,
        userId: creators
      }
    });
    
    newEvent[0].addCategory(categories);
    
    res.json(newEvent);
  } catch (error) {
    res.json(error);
  }
});

const cardEvent = async () => {
  const event = await Event.findAll();
  const cards = event.map((el) => {
    return {
      id: el.id,
      name: el.name,
      eventPic: el.eventPic,
      date: el.date,
      time: el.time,
      price: el.price,
    };
  });
  return cards;
};
router.get("/", async (req, res) => {
  const allCards = await cardEvent();
  res.status(200).send(allCards);
});

router.post("/filters", async (req, res) => {
  const {
    name,
    category,
    rating,
    initialDate,
    finalDate,
    initialPrice,
    finalPrice,
  } = req.body;
 

  let options = { where: { [Op.and]: [] } };

  if (name) {
    options.where[Op.and].push({ name: { [Op.iLike]: "%" + name + "%" } });
  }

  if (rating) {
    options.where[Op.and].push({ rating: { [Op.gte]: rating } });
  }

  if (category) {
    options.where[Op.and].push({ category: { [Op.contains]: category } });
  }

  if ((initialDate, finalDate)) {
    options.where[Op.and].push({
      [Op.and]: [
        { date: { [Op.gte]: initialDate } },
        { date: { [Op.lte]: finalDate } },
      ],
    });
  }

  if ((initialPrice, finalPrice)) {
    options.where[Op.and].push({
      [Op.and]: [
        { price: { [Op.gte]: initialPrice } },
        { price: { [Op.lte]: finalPrice } },
      ],
    });
  }

  Event.findAll(options).then((response) => {
    res.send(response);
  });
  
});

module.exports = router;
