var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/shortlyDB');

// mongoose.connect('mongodb://localhost/shortlyDB');

module.exports.db = mongoose.connection;
