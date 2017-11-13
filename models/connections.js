/**
 * Created by alexn on 09/11/2017.
 */
var mongoose = require('mongoose')
var Schema = mongoose.Schema



var schema = new Schema({
  userId: {type:String,unique:true}});



module.exports = mongoose.model('Connections', schema)