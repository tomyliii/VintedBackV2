const mongoose = require("mongoose");

const Offer = mongoose.model("Offer", {
  product_name: String,
  product_description: String,
  product_price: Number,
  product_details: Array,
  product_image: Object,
  product_state: { type: Boolean, default: true },
  history: {
    date_of_creation: { type: Date, default: new Date() },
    date_of_modification: Array,
    view: { type: Number, default: 0 },
    date_of_purchase: { type: Date },
  },
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

module.exports = Offer;
