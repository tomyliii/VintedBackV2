const express = require("express");
const router = express.Router();
const Transaction = require("../models/Transaction");
const Offer = require("../models/Offer");
const User = require("../models/User");
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);

router.post("/pay", async (req, res) => {
  try {
    const stripeToken = req.body.stripeToken;
    let amount = req.body.price;
    const userID = req.body.userId;
    console.log(userID);
    if (Number.isInteger(amount)) {
      amount = Number(`${amount}00`);
    } else {
      amount = Number(amount.toFixed(2).toString().replace(".", ""));
    }

    const charge = await stripe.charges.create({
      amount: amount,
      currency: "eur",
      source: stripeToken,
      description: req.body.title,
    });

    if (charge.status === "succeeded") {
      const offer = await Offer.findById(req.body.offerId).populate("owner");
      const buyer = await User.findById(userID);
      const owner = offer.owner;
      console.log("acheteur----------------------------------", buyer);
      offer.product_state = false;
      offer.history.date_of_purchase = new Date();
      offer.buyer = buyer;

      const newTransction = new Transaction({
        offer,
        buyer,
        owner,
        price: req.body.price,
      });

      await offer.save(), newTransction.save();

      res.status(200).json(charge);
    } else {
      res.status(400).json(charge);
    }
  } catch (error) {
    if (error.status) {
      res.status(error.status).json({ message: error.message });
    } else {
      res.status(400).json({ message: error.message });
    }
  }
});

module.exports = router;
