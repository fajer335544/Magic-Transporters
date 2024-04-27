const mongoose = require("mongoose");

const Schema = mongoose.Schema;
/*

activity: 'Loading items',
      moverId: magicMover._id,
      itemsLoaded: itemsToLoad.map(item => item._id),


*/
const LogSchema = new Schema(
  {
    activity:{
        type:String
    },
    moverId:{
        type:Schema.Types.ObjectId,
        ref:'MagicMover'
    },
    itemsLoaded:[{
        type:Schema.Types.ObjectId,
        ref:'MagicItem'
    }]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Log", LogSchema);
