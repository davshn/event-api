const { Router } = require("express");
const { Event, User, Ticket } = require("../db");
const auth = require("../Middleware/auth");


const router = Router();

// esta ruta es para ver todos los tickets de esa persona

router.get("/", async (req, res) => {
    try {
        const userId = req.body.userId 
        
        const allTickets = await Ticket.findAll()   

        // const allTickets = await Ticket.findAll({where: {userId: userId}})  // el userId esta null
        // const allTickets = await User.findOne({
        //     where: {
        //         id: userId
        //     },
        //     include: [
        //         {
        //         model: Ticket,
        //         attributes: ["idTicket","quantity", "place", "date", "time", "price", "createdAt"]
        //         }
        //     ],
              
        // });

        res.status(200).json(allTickets)    
    
    } catch (error) {
        console.log(error)
        res.status(404).send({ message: "Usuario no encontrado"})
    }
})


// esta ruta es para el detalle de cada ticket

router.get('/:idTicket', async function(req, res) {
    
    const idTicket = req.params.idTicket;
    
    try {
        const oneTicket = await Ticket.findOne({
            where: {
                idTicket: idTicket
            }, // no incluye lo de abajo
            include: [
                {
                model: User,
                attributes: ["name", "email"]
                },
                {
                model: Event,
                attributes: ["id", "name","place", "date", "time", "eventPic", "userId"] // ver si el user id es el creador
                }
            ]
        });
        res.status(404).json({oneTicket})
    } catch (error) {
        console.log(error)
        res.status(404).send({ message: "El ticket no existe"})
    }
});


// esta ruta es para postear un ticket cuando se compra

router.post("/createTicket", async (req, res) => {

    try {
        let allItems = req.body;
        console.log(allItems)
        // creo 1 ticket por cada objeto del carrito menos el último que trae toda la data junta
        for (let i = 0 ; i < allItems.length -1 ; i++){ 
            
            let newTicket = await Ticket.create({
                eventName: allItems[i].eventName ,
                place: allItems[i].place ,
                date: allItems[i].date ,
                time: allItems[i].time ,
                quantity: allItems[i].quantity,
                price: allItems[i].price,
                //eventId: allItems[i].eventId
                //userId: allItems[i].userId,
            });
            // newTicket.addEvent(allItems[i].eventId)
            // newTicket.addUSer(allItems[i].userId)

        //actualizo la cantidad del availableStock del evento
            let eventSearchId = allItems[i].eventId
            let eventToUpdateStock = await Event.findOne({ where: { id: eventSearchId } });
            console.log(eventToUpdateStock)
            // let newStock = stockToUpdate.availableStock - allItems[i].quantity

            // await stockToUpdate.set({
            //     availableStock: newStock
            // })
                
            // await eventToUpdate.save()
        }

        res.status(200).json({ message: "Ticket creado con éxito" });

      } catch (error) {
            console.log(error)
            res.status(500).json({message: "Error al generar el ticket"});
      }
});


module.exports = router;