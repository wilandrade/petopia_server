var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../../db/tables/db_users.js');
var UserModel = require('../../db/tables/db_users.js').User;

module.exports = function(){

  // used to serialize the user for the session
  passport.serializeUser(function(user, done){
    done(null, user.id);
  });

  // used to deserialize the user
  passport.deserializeUser(function(id, done){
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  passport.use('local-login', new LocalStrategy(function(username, password, done){
    UserModel.findOne({ username: username }, function(err, user) {
      if(err) {
        return done(err);
      }
      if(!user) {
        return done(null, false, { message: 'Invalid username' });
      } else {
        if(User.validatePassword(password, user.password)) {
          return done(null, user);
        } else {
          return done(null, false, { message: 'Invalid password' });
        }
      }
    });
  }));

  passport.use('local-signup', new LocalStrategy(function(username, password, done){
    UserModel.findOne({ username: username }, function(err, user){
      if(err){
        return done(err);
      }
      if(user){
        return done(null, false, { message: 'Username already exists.' });
      } else {
        var newUser = {
          username: username,
          password: password,
        };

        User.signupUser(newUser, done);
      }
    });
  }));

};
