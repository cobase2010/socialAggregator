var passport = require('passport')
var TwitterStrategy = require('passport-twitter').Strategy
var User = require('../../models/userModel')

module.exports = function () {
  passport.use(new TwitterStrategy({
    consumerKey: 'iD436BfDqJXKst25K8d550Fja',
    consumerSecret: 'y76oPQLcPBfVBHzWJfff3O4rx4ZNeVSR3wOopW9sgPtdmT3bhW',
    callbackURL: 'http://localhost:3000/auth/twitter/callback',
    passReqToCallback: true
  },
    function (req, token, tokenSecret, profile, done) {
      if (req.user) {
        var query = {}
        if (req.user.google) {
          console.log('google')
          query = {
            'google.id': req.user.google.id
          }
        } else if (req.user.facebook) {
          query = {
            'facebook.id': req.user.facebook.id
          }
        }
        User.findOne(query, function (error, user) {
          if (user) {
            user.twitter = {}
            user.twitter.id = profile.id
            user.twitter.token = token
            user.twitter.tokenSecret = tokenSecret
            user.save()
            done(null, user)
          }
        })
      } else {
        query = {
          'twitter.id': profile.id
        }
        User.findOne(query, function (error, user) {
          if (error) {
            console.error('Error doing query.')
            done(null, new User())
          }
          if (user) {
            console.log('found')
            done(null, user)
          } else {
            console.log('not found')
            user = new User()
              // user.email = profile.emails[0].value
            user.image = profile._json.image.url
            user.displayName = profile.displayName
            user.twitter = {}
            user.twiiter.id = profile.id
            user.twitter.token = token
            user.twitter.tokenSecret = tokenSecret
            user.save()
            done(null, user)
          }
        })
      }
    }))
}
