var request = require('request');
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var util = require('../lib/utility');

var db = require('../app/config');
var User = require('../app/models/user');
var Link = require('../app/models/link');

exports.renderIndex = function(req, res) {
  res.render('index');
};

exports.signupUserForm = function(req, res) {
  res.render('signup');
};

exports.loginUserForm = function(req, res) {
  res.render('login');
};

exports.logoutUser = function(req, res) {
  req.session.destroy(function(){
    res.redirect('/login');
  });
};

exports.fetchLinks = function(req, res) {
  Link.find({}, function(err, links){
    res.send(200, links);
  });
};

exports.saveLink = function(req, res) {
  var uri = req.body.url;

  if (!util.isValidUrl(uri)) {
    console.log('Not a valid url: ', uri);
    return res.send(404);
  }

  Link.find({ url: uri }, function(err, links){
    if(err) throw err;
    if(links.length){
      res.send(200, links) //link already exist
    } else { //create new link
      util.getUrlTitle(uri, function(err, title){
        if (err){
          return res.send(404);
        } else {
          var newLink = new Link({
            url: uri,
            title: title,
            base_url: req.headers.origin,
            visits: 0
          });
          newLink.save(function(err){
            if(err) throw err;
            res.send(200, newLink);//created new link
          });
        }
      });
    }
  });
};

exports.loginUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  User.find({username: username}, function(err, users){
    if (err) throw err;
    if (users.length){
      users[0].comparePassword(password, function(matched){
        if(matched){
          util.createSession(req, res, users[0]);
        } else {
          res.redirect('/login');
        }
      });
    } else {
      res.redirect('/login')
    }
  });
};

exports.signupUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  User.find({ username: username }, function(err, users){
    if(err) throw err;
    if(users.length){
      res.redirect('/signup');
    } else { //create
      var newUser = new User({
        username: username,
        password: password
      });
      newUser.save(function(err){
        if(err) throw err;
        util.createSession(req, res, newUser);
      });
    }
  });
};

exports.navToLink = function(req, res) {

  Link.find({code: req.params[0]}, function(err, links){
    if (err) throw err;
    if (links.length){
      var link = links[0];
      link.visits ++;
      link.save(function(err){
        if (err) throw err;
        res.redirect(link.url)
      })
    } else {
      res.redirect('/')
    }
  });
};
