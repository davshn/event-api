const { Router } = require("express");
const { Event, User, Ticket } = require("../db");
const auth = require("../Middleware/auth");


const router = Router();

router.get("/", async (req, res) => {
    try {
      // console.log(req.body)
      const eventId = req.body.id;
      const quantity = req.body.quantity || 0  // si no me pasas la cantidad, cantidad es 0 y solo sirve para chequear el stock total
      
      const event = await Event.findOne({ where: { id: eventId } });
      
      if (event) {
        const stock = event.availableStock
        if (stock < quantity) {
          res.status(403).json({ message: "No hay suficiente stock de entradas para este evento" , stock})
        }
        else {
          res.status(200).json({ message: "Hay stock disponible", stock });
        }
      }

      else res.status(404).json({ message: "Evento no encontrado" });
      
    } catch (error) {
      res.status(400).json({ message: "Error al verificar stock" });
    }
    
  })

  router.get("/allCartItems", async (req, res) => {
    try {
      const allItems = req.body;
      let stockOK = true

      for (let i = 0 ; i < allItems.length -1 ; i++){ 
       
        let event = await Event.findOne({ where: { id: allItems[i].id } });
        let quantity = allItems[i].quantity 

        if (event) {
          let stock = event.availableStock
          if (stock >= quantity) { //el stock, es mayor que la cantidad que quiero comprar?
            stockOK = true            
          }
          else {
            stockOK = false
            break
          }
        }
        else { res.status(400).json({ message: "No existe el evento para verificar el stock" });
        } 
      }
      res.status(200).send(stockOK) 
            
    } catch (error) {
      res.status(400).json({ message: "Error al verificar stock" });
    }
    
  })

  
module.exports = router;