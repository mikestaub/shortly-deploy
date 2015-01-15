var mongoose = require('mongoose');

var host = process.env.MONGO_URI || 'mongodb://localhost/shortlyDB';

mongoose.connect(host);

module.exports.db = mongoose.connection;
