const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const magicItem = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    weight: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("MagicItem", magicItem);
