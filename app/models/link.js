var db = require('../config');
var crypto = require('crypto');
var mongoose = require('mongoose');

var LinkSchema = new mongoose.Schema({
  code: String,
  title: String,
  base_url: String,
  url: String,
  visits: Number
});

var Link = mongoose.model('Link', LinkSchema);

LinkSchema.pre('save', function(next, path, val, typel){
  if(this.isNew){
    var shasum = crypto.createHash('sha1');
    shasum.update(this.url);
    this.code = shasum.digest('hex').slice(0, 5);
    next();
  } else {
    next();
  }
});

module.exports = Link;
