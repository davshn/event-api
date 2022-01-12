const { Router } = require("express");
const { Event, User, Category } = require("../db");
const { Op } = require("sequelize");

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
  } = req.body;
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
  console.log(req.body)

  let options = { where: { [Op.and]: [] } };

  if (name) {
    options.where[Op.and].push({ name: { [Op.iLike]: "%" + name + "%" } });
  }

  if (rating) {
    options.where[Op.and].push({ rating: { [Op.eq]: rating } });
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
  console.log(options);
});

module.exports = router;
