var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var Schema = mongoose.Schema;
var random = require('mongoose-simple-random');

var UserSchema = new mongoose.Schema({

    email: {
        type: String,
        lowercase: true,
        trim:true,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['reader', 'creator', 'editor'],
        default: 'reader'
    },
    userName: {
        type: String

    },
    arenas:[
        {
            type: Schema.Types.ObjectId,
            ref: 'Arena'
        }
    ]





}, {
    timestamps: true
});

UserSchema.pre('save', function(next){

    var user = this;
    var SALT_FACTOR = 5;

    if(!user.isModified('password')){
        return next();
    }

    bcrypt.genSalt(SALT_FACTOR, function(err, salt){

        if(err){
            return next(err);
        }

        bcrypt.hash(user.password, salt, null, function(err, hash){

            if(err){
                return next(err);
            }

            user.password = hash;
            next();

        });

    });

});

UserSchema.methods.comparePassword = function(passwordAttempt, cb){

    bcrypt.compare(passwordAttempt, this.password, function(err, isMatch){

        if(err){
            return cb(err);
        } else {
            cb(null, isMatch);
        }
    });

}
UserSchema.plugin(random);
module.exports = mongoose.model('User', UserSchema);