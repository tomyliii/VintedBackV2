const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const isAuthentificated = require("../middelware/isAuthentificated");
const Transaction = require("../models/Transaction");
const Offer = require("../models/Offer");
const User = require("../models/User");
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);
router.post("/pay", async (req, res) => {
  try {
    const stripeToken = req.body.stripeToken;
    let amount = req.body.price;
    console.log(req.body.price);
    if (Number.isInteger(amount)) {
      amount = Number(`${amount}00`);
    } else {
      amount = Number(amount.toFixed(2).toString().replace(".", ""));
    }
    console.log(amount);

    const charge = await stripe.charges.create({
      amount: amount,
      currency: "eur",
      source: stripeToken,
      description: req.body.title,
    });
    console.log(charge);
    if (charge.status === "succeeded") {
      const offer = await Offer.findById(req.body.offerId).populate("owner");
      const buyer = await User.findById(req.body.userId);
      const owner = offer.owner;
      console.log(offer, buyer, owner);
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
    }
    res.status(200).json(charge);
  } catch (error) {
    res.json(error);
    if (error.status) {
      res.status(error.status).json({ message: error.message });
    } else {
      res.status(400).json({ message: error.message });
    }
  }
});

module.exports = router;
