const express=require('express');

const {body}=require('express-validator')
const Router=express.Router();


const magicitemController=require('../controllers/magicitemController');
const ValidateErrors= require("../Handler/errors");

Router.put("/add",[
   
    
    body('name').isLength({min:3,max:20}).withMessage('the length of name should be between 3 and 20 characters'),
     body('weight').isInt({lt:11}).withMessage('the weight should be smaller then 11'),

],ValidateErrors,magicitemController.createMagicItem)


module.exports = Router;


