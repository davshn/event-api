const { Router } = require("express");
const { Event, Category } = require("../db");
const { Op } = require("sequelize");
const searchCategory = require("./controls");
const auth = require("../Middleware/auth");

const router = Router();

router.post("/", auth, async function (req, res) {
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
    capacity
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
        capacity,
        availableStock: capacity,
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
  try {
    const event = await Event.findAll( { where: { isDeleted: false } } );
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
    
  } catch (error) {
      console.log(error);
  }
};

router.get("/", async (req, res) => {
  const allCards = await cardEvent();
  res.status(200).send(allCards);
});

router.post("/filters", async (req, res) => {
  let date = new Date();
  let today=date.toISOString().split('T')[0]


  const { name, category, initialDate, finalDate, initialPrice, finalPrice } =
    req.body;
 

  let options = {
    where: { [Op.and]: [{date: { [Op.gte]: today}} ] },
    include: [{ model: Category, required: true }],
  };

  if (name) {
    options.where[Op.and].push({ name: { [Op.iLike]: "%" + name + "%" } });
  }

  if (category) {
    options.where[Op.and].push({});
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

// con esta ruta edita el evento de la base de datos -- si pongo router.put("/...", ......) no funciona

router.post("/updateEvent", async (req, res) => {
  try {
    const eventId = req.body.id;
    const editCapacity = req.body.capacity 
    const eventToUpdate = await Event.findOne({ where: { id: eventId } });
    
    if (eventToUpdate) {  
      const difCapacity = eventToUpdate.capacity - editCapacity
      // Case 1: 800 = 1000-200    Tengo 1000 lugares, quiero pasarlo a 200. Dif 800 
      // Case 2: -450 = 1000 - 1450     Tengo 1000 lugares, quiero pasarlo a 1450. Dif -450
      if ( eventToUpdate.availableStock >= difCapacity) {
        // Case 1: 700 > 800 (false)  Si mi stock es 700 >= y la diff es de 800, da false y no entra
        // Case 2: 700 > -450 (true)  Si mi stock es de 700 >= y la dif es de -300, da true y entra para editar el evento
        const newStock = editCapacity - eventToUpdate.capacity + eventToUpdate.availableStock
          // Case 1: No entró antes
          // Case 2: nuevo stock 1150 = 1450 - 1000 + 700    Tengo 1450 nuevos lugares - 1000 que tenia + 700 de stock
          // esta logica esta mal, el available stock no es lo que tiene que ser
        await eventToUpdate.set({
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
          capacity: req.body.capacity,
          availableStock: newStock
        })
        
        await eventToUpdate.save()
  
        res.status(200).send({ message: "Evento editado con éxito" });
      }
      else {
        res.status(403).json({ message: `No pudes editar la cantidad de entradas disponibles, debido a tu stock actual para la venta (Stock: ${eventToUpdate.availableStock} entradas)` })
      }
    }
    
    else res.status(404).send({ message: "Evento no encontrado" });
    
  } catch (error) {
    res.status(400).send({ message: "Error al editar el evento" });
  }
  
})

router.post("/deleteEvent", async (req, res) => {
  try {
    const eventId = req.body.id;
    
    const eventDelete = await Event.findOne({ where: { id: eventId } });
    
    if (eventDelete) {
      if (eventDelete.availableStock !== eventDelete.capacity ) {
        res.status(403).json({ message: "No puedes eliminar un evento que tenga entradas vendidas" })
      }
      else {
        await eventDelete.set({
          isDeleted: true
        })
    
        await eventDelete.save()
    
        res.status(200).send("Evento eliminado con éxito");
      }
    }
    
    else res.status(404).send("Evento no encontrado");
    
  } catch (error) {
    res.status(400).send("Error al eliminar el evento");
  }
  
})

// con esta ruta borra el evento de la base de datos -- si pongo router.delete("/...", ......) no funciona
// en teoria no se deberían borran los eventos, sino hacerles un flag buleano para mostrar si esta "disponible" o no en DB
// queda comentada esta forma, usar la de arriba

// router.get("/deleteEvent", async (req, res) => {
//   try {
//     const eventId = req.body.id;
    
//     const eventDelete = await Event.findOne({ where: { id: eventId } });
    
//     if (eventDelete) {

//       // logica para que si hay 1 entrada vendida, ya no se puede borrar el evento
//       //  responder  res.status(500).json({ message: "No hay stock" });
//       await eventDelete.destroy()
//       res.status(200).send("Evento eliminado con éxitos");
//     }
    
//     else res.status(404).send("Evento no encontrado");
    
//   } catch (error) {
//     res.status(400).send("Error borrando el evento");
//   }
  
// })


module.exports = router;
