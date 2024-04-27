
const MagicItem=require('../models/magic-item')
exports.createMagicItem=(req, res, next)=>{
   
    const name=req.body.name;
   const weight=req.body.weight;
  
    
 
   try{
   const magicmover= MagicItem.create({
      
       weight:weight,
       name:name  

   })
   res.status(201).json({message:"success added magic Item "})
 
 }
   catch (error){
    res.status(500).json({message:" Server Error !"})
     console.error(error)
   }   
}
