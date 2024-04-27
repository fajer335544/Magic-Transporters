const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const magicmoverSchema = new Schema(
  {
    weight: {
      type: Number,
      required: true,
    },
    energy: { type: Number, required: true },
    quest: {
      type: String,
      enum: ["resting", "loading", "done", "on a mission"],
      required: true,
    },
    missionsCompleted:{type: Number ,default:0,required: false},

    items: [
      {
        type: Schema.Types.ObjectId,
        ref: "MagicItem",
      },
    ],
  },

  { timestamps: true }
);
module.exports = mongoose.model("MagicMover", magicmoverSchema);
