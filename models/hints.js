/**
 * Created by alexn on 18/12/2017.
 */
/**
 * Created by alexn on 20/07/2017.
 */
var mongoose = require('mongoose')
var Schema = mongoose.Schema
var moment = require('moment')

var schema = new Schema({
  userId: {type: Schema.Types.ObjectId, ref: 'Users', unique: true},
  managerAdvice: {
    isActive: {type: Boolean, default: true},
    willBeActive: {type: Date, default: moment().format()}
  },
  extraTime: {
    isActive: {type: Boolean, default: true},
    willBeActive: {type: Date, default: moment().format()}
  }

})

schema.methods.checkIfActivate = function () {
  try {
    if (this.userId !== undefined) {
      if (this.managerAdvice.isActive===false && moment().isSameOrAfter(this.managerAdvice.willBeActive)) {
        console.log('inside');
        this.managerAdvice.isActive = true
        return this.save()

      }
      else if (this.extraTime.isActive === false &&  moment().isSameOrAfter( this.extraTime.willBeActive,'day')) {
        this.extraTime.isActive = true
        return this.save()
      }else{
        return false;
      }
    }
    else{
      return false;
    }
  } catch (err) {
    return false;
  }
}

schema.methods.useHint =  function (hintUsed) {
  try {

    console.log(this.managerAdvice)
    if (this.userId !== undefined) {
      if (hintUsed === 'managerAdvice' && this.managerAdvice.isActive === true) {
        console.log('inside manageradvice')
        this.managerAdvice.isActive = false
        this.managerAdvice.willBeActive = moment().add(1, 'h')
         return this.save()

      }
      else if (hintUsed === 'extraTime' && this.extraTime.isActive === true) {
        this.extraTime.isActive = false
        this.extraTime.willBeActive = moment().add(1, 'h')
        return this.save()

      }
      else {
        return false
      }
    }
  } catch (err) {
    return false
  }

}

module.exports = mongoose.model('Hints', schema)