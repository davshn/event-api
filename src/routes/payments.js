require("dotenv").config();
const { Router } = require("express");
const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const router = Router();

router.post("/", async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: "Please enter a name" });
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(25 * 100),
      currency: "usd",
      payment_method_types: ["card", "paypal"],
      metadata: { name },
    });
    const clientSecret= paymentIntent.client_secret;

    res.json({message:'Payment initiated ', clientSecret})
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "error in the payment" });
  }
});

module.exports = router;
