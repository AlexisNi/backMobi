/**
 * Created by alexn on 18/12/2017.
 */
/**
 * Created by alexn on 20/07/2017.
 */
var mongoose = require('mongoose')
var Schema = mongoose.Schema
var moment = require('moment');

var schema = new Schema({
  userId: {type: Schema.Types.ObjectId, ref: 'Users'},
  managerAdvice: {
    isActive: {type: Boolean, default: true},
    willBeActive: {type: Date,default:moment().format()}
  },
  extraTime: {
    isActive: {type: Boolean, default: true},
    willBeActive: {type: Date,default:moment().format()}
  }

})

schema.methods.checkIfActivate = function () {
  try {
    if (this.userId !== undefined) {
      if (this.managerAdvice.willBeActive >= moment().format()) {
        this.managerAdvice.isActive = true
        this.schema.save()

      }
      if (this.extraTime.isActive === false && this.extraTime.willBeActive >= moment().format()) {
        this.extraTime.isActive = true
        this.schema.save()
      }
    }
  } catch (err) {
  }
}

schema.methods.useHint=function (hintUsed) {
  try {
    if(this.userId!==undefined){
      if(hintUsed==='managerAdvice'){
        this.managerAdvice.isActive=false;
        this.managerAdvice.willBeActive=moment().add(1,h);
        this.schema.save();
      }
      if(hintUsed==='extraTime'){
        this.extraTime.isActive=false;
        this.extraTime.willBeActive=moment().add(1,h);
        this.schema.save();
      }
    }
  }

}

schema.index({userId: 1}, {unique: true})
module.exports = mongoose.model('Hints', schema)