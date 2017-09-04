/**
 * Created by alexn on 29/08/2017.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var uniqueValidator=require('mongoose-unique-validator');


var schema = new Schema({
  userId:{ type: Schema.Types.ObjectId, ref: 'Users' },
  last5Matches:{ type : Array , "default" : [] }


});




schema.index({ userId:1},{unique:true});
schema.plugin(uniqueValidator);
module.exports = mongoose.model('last5Matches', schema);