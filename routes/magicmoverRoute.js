const express = require("express");

const { body, param } = require("express-validator");
const Router = express.Router();

const magicmoverController = require("../controllers/magicmoverController");
const ValidateErrors = require("../Handler/errors");

const MagicMover = require("../models/magic-mover");

const MagicItem = require("../models/magic-item");

const validStatusValues = ["done", "resting", "loading", "on a mission"];
Router.put(
  "/add",
  [
    body("weight")
      .isInt({lt:100})
      .withMessage("please insert a number value in weight parameter between 1 and 99"),
    body("energy")
      .notEmpty()
      .isInt()
      .withMessage("please insert a number value in energy parameter"),
    body("quest").custom(async (value) => {
      if (!validStatusValues.includes(value)) {
        throw new Error(
          "value in quest should be in [resting, done, loading, on a mission]"
        );
      }
    }),
  ],
  ValidateErrors,
  magicmoverController.createMagicMover
);

Router.put(
  "/items/:moverId/load",
  [
    param("moverId")
      .isLength({min:24, max:24})
      .custom(async (value) => {
        const mover = await MagicMover.findById(value);
        if (!mover) {
          throw new Error("the mover did not find ");
        }
      }),

      
    
  ],

  ValidateErrors,

  magicmoverController.LoadMagicMoverWithItems
);
Router.patch("/items/:moverId/startmission",

[
  param("moverId")
    .isLength({min:24, max:24})
    .custom(async (value) => {
      const mover = await MagicMover.findById(value);
      if (!mover) {
        throw new Error("the mover did not find ");
      }
    }),

    
  
],

ValidateErrors,

magicmoverController.StartMission);

Router.patch("/items/:moverId/endmission", magicmoverController.EndMission);

Router.get("/mostMissionsCompleted", magicmoverController.MostMission);

module.exports = Router;
