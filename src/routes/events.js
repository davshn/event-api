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

router.get("/filter", async (req, res) => {
    const allCards = await cardEvent();
    res.status(200).send(allCards);
  });

const filterByName = async (name) => {
  try {
    let dataByName = await Event.findAll({
      where: {
        name: { [Op.iLike]: "%" + name + "%" },
      },
    });
    console.log(dataByName);
    return dataByName;
  } catch (error) {
    return "Evento no encontrado";
  }
};

// router.get("/filter", async (req, res) => {
//   const { name } = req.body;

//   if (name) {
//     let filteredByName = await filterByName(name);

//     filteredByName.length
//       ? res.status(200).send(filteredByName)
//       : res.status(400).send("No existe el evento");
//   }
// });

module.exports = router;
