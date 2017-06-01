var mongoose = require('mongoose');
var Schema = mongoose.Schema;



var schema = new Schema({
    user:{type: Schema.Types.ObjectId, ref: 'Users'},
    firebase_id:{type:String,unique:true},
    level:{type:Number,default:1},
    currentExp:{type:Number,default:0},
    wins:{type:Number,default:0},
    loses:{type:Number,default:0},
    draws:{type:Number,default:0}
});



module.exports = mongoose.model('Stats', schema);
