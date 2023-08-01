const mongoose = require("mongoose");

const Transaction = mongoose.model("Transaction", {
  offer: { type: mongoose.Schema.Types.ObjectId, ref: "Offer", require: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", require: true },
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: "User", require: true },
  price: Number,
  date_of_purchase: { type: Date, default: new Date() },
});

module.exports = Transaction;
