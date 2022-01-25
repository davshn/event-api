require("dotenv").config();
const { Router } = require("express");
const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const router = Router();

router.post("/", async (req, res) => {
  
  try {
    const { name , price } = req.body;

    if (!name) return res.status(403).json({ message: "Debes estar logueado para comprar entradas" });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: price,
      currency: "eur",
      payment_method_types: ["card", "paypal"],
      metadata: { name },
    });
    const clientSecret = paymentIntent.client_secret;
    res.json({ message: "Payment initiated ", clientSecret });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "payment error back " });
  }
});

router.post("/stripe", async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;
  try {
    event = await Stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: err.message });
  }

  if (event.type === "payment_intent.created") {
    console.log(`${event.data.object.metadata.name} initiated payment!`);
  }
  if (event.type === "payment_intent.succeeded") {
    console.log(`${event.data.object.metadata.name} Payment succeeded!`);
  }

  res.json({ ok: true });
});

module.exports = router;
