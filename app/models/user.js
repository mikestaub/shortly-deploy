var db = require('../config');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');
var mongoose = require('mongoose');


var UserSchema = new mongoose.Schema({
  username: String,
  password: String
});

UserSchema.pre('save', function(next, path, val, typel){
  if(this.isNew){
    var self = this;
    bcrypt.hash(this.password, null, null, function(err, hash){
      self.password = hash;
      next();
    });
  } else {
    next();
  }
})

UserSchema.methods.comparePassword = function comparePassword(attemptedPassword, callback){
 bcrypt.compare(attemptedPassword, this.password, function(err, isMatch) {
    callback(isMatch);
  });
}

var User = mongoose.model('User', UserSchema);

module.exports = User;
