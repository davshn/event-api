const { Router } = require("express");
const { Event, Category } = require("../db");
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

    category,
    eventPic,
    eventVid,
    comment,
    longitude,
    latitude,
  } = req.body;
  try {
    const categories = await searchCategory(category);
    const newEvent = await Event.findOrCreate({
      where: {
        name: name,
        date: date,
        time: time,
      },
      defaults: {
        description,
        place,
        price,
        eventPic,
        eventVid,
        longitude,
        latitude,
        userId: creators,
      },
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
  const { name, category, initialDate, finalDate, initialPrice, finalPrice } =
    req.body;
    

  let options = {
    where: { [Op.and]: [] },
    include: [{ model: Category, required: true }],
  };

  if (name) {
    options.where[Op.and].push({ name: { [Op.iLike]: "%" + name + "%" } });
  }

  if (category) {
    options.where[Op.and].push({  });
    options.include = [{ model: Category, where: { name: category } }];
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

// con esta ruta borra el evento de la base de datos -- si pongo router.put("/...", ......) no funciona

router.get("/updateEvent", async (req, res) => {
  try {
    const eventId = req.body.id;
    
    const eventUpdate = await Event.findOne({ where: { id: eventId } });
    console.log(eventUpdate)
    if (eventUpdate) {
      await eventUpdate.set({
        name: req.body.name,
        description: req.body.description,
        place: req.body.place,
        date: req.body.date,
        time: req.body.time,
        price: req.body.price,
        eventPic: req.body.eventPic,
        eventVid: req.body.eventVid,
        longitude: req.body.longitude,
        latitude: req.body.latitude,
      })
      
      await eventUpdate.save()

      res.status(200).send("Evento Editado");
    }
    
    else res.status(404).send("Evento no encontrado");
    
  } catch (error) {
    res.status(400).send("Error al editar el evento");
  }
  
})

// con esta ruta borra el evento de la base de datos -- si pongo router.delete("/...", ......) no funciona

router.get("/deleteEvent", async (req, res) => {
  try {
    const eventId = req.body.id;
    
    const eventDelete = await Event.findOne({ where: { id: eventId } });
    
    if (eventDelete) {
      await eventDelete.destroy()
      res.status(200).send("Evento Borrado");
    }
    
    else res.status(404).send("Evento no encontrado");
    
  } catch (error) {
    res.status(400).send("Error borrando el evento");
  }
  
})

module.exports = router;
