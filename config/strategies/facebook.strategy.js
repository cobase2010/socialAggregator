var passport = require('passport')
var FacebookStrategy = require('passport-facebook').Strategy
var User = require('../../models/userModel')

module.exports = function () {
  passport.use(new FacebookStrategy({
    clientID: '1252092498184971',
    clientSecret: '26df3c64f4216bdedf22314e99dc0b1d',
    callbackURL: 'http://localhost:3000/auth/facebook/callback',
    passReqToCallback: true,
    profileFields: ['id', 'displayName', 'photos', 'emails']
  },
  function (req, accessToken, refreshToken, profile, done) {
    if (req.user) {
      var query = {}
      if (req.user.google) {
        console.log('google')
        query = {
          'google.id': req.user.google.id
        }
      } else if (req.user.twitter) {
        query = {
          'twitter.id': req.user.twitter.id
        }
      }
      User.findOne(query, function (error, user) {
        if (user) {
          user.facebook = {}
          user.facebook.id = profile.id
          user.facebook.accessToken = accessToken
          user.facebook.refreshToken = refreshToken
          user.save()
          done(null, user)
        }
      })
    } else {
      var query = {
        'facebook.id': profile.id
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
          user.email = profile.emails[0].value
        // user.image = profile._json.image.url
          user.displayName = profile.displayName
          user.facebook = {}
          user.facebook.id = profile.id
          user.facebook.token = accessToken
          user.facebook.refreshToken = refreshToken
          user.save()
          done(null, user)
        }
      })
    }
  }))
}
