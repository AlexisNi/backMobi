/**
 * Created by alexn on 20/07/2017.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var schema = new Schema({
  userId: {type: Schema.Types.ObjectId, ref: 'Users',unique:true},
  history:{
    user:{
      userId:String,
      wins:{type:Number,default:0},
      loses:{type:Number,default:0},
      draws:{type:Number,default:0}
    }
  }
});

/*
schema.index({userId: 1, 'history.user.userId': 1}, {unique: true})
*/
module.exports = mongoose.model('History', schema);