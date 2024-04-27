const MagicMover = require("../models/magic-mover");
const MagicItem = require("../models/magic-item");
const Log = require("../models/Log");
exports.createMagicMover = (req, res, next) => {
  const weight = req.body.weight;
  const energy = req.body.energy;
  const quest = req.body.quest;

  try {
    const magicmover = MagicMover.create({
      weight: weight,
      energy: energy,
      quest: quest,
    });
    res.status(201).json({ message: "success added magic mover " });
  } catch (error) {
    res.status(500).json({ message: " Server Error !" });
    console.error(error);
  }
};
exports.LoadMagicMoverWithItems = async (req, res, next) => {
  const { moverId } = req.params;
  const { itemsId } = req.body;

  let hasInvalidItem = false;

  itemsId.map((item) => {
    //here to check every item inserted in array is an ObjectId Valued
    if (item.length !== 24) {
      hasInvalidItem = true;
    }
  });

  if (hasInvalidItem) {
    return res.status(404).json({ error: "some of item id's is not valued !" });
  }

  //console.log("moverID    " + moverId + "/n itemID :" + itemsId);

  try {
    // here is the logic to Mover will not have to mush items more than specified number
    let magicMover = await MagicMover.findById(moverId);
    const MoverCarries=await MagicMover.findById(moverId).populate('items')
    let arr=MoverCarries.items
    let MoverCarriesWeight=0;
    const Max_Value_For_Every_Mover=80;
    arr.map(item=>{MoverCarriesWeight=MoverCarriesWeight+item.weight})
  console.log("MoverCarriesWeight before Load ="+MoverCarriesWeight)
    

    const itemsToLoad = await MagicItem.find({ _id: { $in: itemsId } });

 
    //console.log(itemsToLoad);

//here to check if any objectID in array does not  exist so the request will not pass through
    if (itemsToLoad.length !== itemsId.length) {
      return res.status(404).json({ error: "one or more items did not find" });
    }

    let MoverWouldCarries=0;
      itemsToLoad.map(item=>{MoverWouldCarries=MoverWouldCarries+item.weight})
    let All_Weight=MoverWouldCarries+MoverCarriesWeight;
    console.log("MoverCarriesWeight after  Load ="+All_Weight)
    if(All_Weight>Max_Value_For_Every_Mover)
    {
     
      return res.status(400).json({error : " over load for this Mover !! every mover can just carry less than 75 "})
   

    }
   
   
    magicMover.items.push(...itemsToLoad);
    await magicMover.save();
    const getData = await MagicMover.findById(moverId);

    //console.log(itemsToLoad.map(item => item.name))
   // res.status(200).json({ message: getData });

    // Create a log entry for the loading activity
    const logEntry = {
      activity: "Loading items",
      moverId: magicMover._id,
      itemsLoaded: itemsToLoad.map((item) => item._id),
    };

    // Save the log entry to the database or logging system
    // For simplicity, let's assume it's saved to a log collection
    const log = await Log.create(logEntry);
 

    res.status(200).json({ message: 'Magic Mover loaded with items successfully' ,data:getData});
  } catch (error) {
    console.error("Error loading Magic Mover:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.StartMission = async (req, res, next) => {
  const { moverId } = req.params;

  try {
    let magicMover = await MagicMover.findById(moverId);

    if (!magicMover) {
      return res.status(404).json({ error: "Magic Mover not found" });
    }

    if (magicMover.quest === "on a mission") {
      return res
        .status(400)
        .json({ error: "Magic Mover is already on a mission" });
    }

    // Update the Magic Mover's state to 'on a mission'
    magicMover.quest = "on a mission";
    await magicMover.save();

    
    
//Log File
    await Log.create({
      activity: "Starting mission",
      moverId: magicMover._id,
      missionState: "on a mission",
    });

  
    res.status(200).json({ message: "Mission started successfully" });
  } catch (error) {
    console.error("Error starting mission:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.EndMission = async (req, res, next) => {
  const { moverId } = req.params;

  try {
    const magicMover = await MagicMover.findById(moverId);

    if (!magicMover) {
      return res.status(404).json({ error: "Magic Mover not found" });
    }

    if (magicMover.quest === "done")
     {
      return res.status(400).json({ message: "Magic Mover was  already done ! " });
    } else {
    
      magicMover.items = [];

      magicMover.quest = "done";

      magicMover.missionsCompleted+=1;

      await magicMover.save();

      // create object to save it in Log
      const logEntry = {
        activity: "Ending mission",
        moverId: magicMover._id,
        missionState: "done",
      };

      await Log.create(logEntry);

      res.status(200).json({ message: "Mission ended successfully" });
    }
  } catch (error) {
    console.error("Error ending mission:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.MostMission = async (req, res, next) => {

  try {
    const magicMover = await MagicMover.findOne().sort('-missionsCompleted')
    if(!magicMover){
      res.status(404).json({error :"no mover ended his mission"})
    }
    res.status(200).json({message: magicMover})
  } catch (error) {
    console.error(
      "Error getting Magic Mover with the most completed missions:",
      error
    );
    res.status(500).json({ error: "Internal server error" });
  }
};
