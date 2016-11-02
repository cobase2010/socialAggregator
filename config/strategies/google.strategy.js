var passport = require('passport')
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
var User = require('../../models/userModel')

module.exports = function () {
  passport.use(new GoogleStrategy({
    clientID: '910465511904-7vbr27ip5vvhc7n7lc9nh0jfbkk2r0i5.apps.googleusercontent.com',
    clientSecret: 'FeN2MT6_Ccm1DamqEHqLIenD',
    callbackURL: 'http://localhost:3000/auth/google/callback'
  },
    function (req, accessToken, refreshToken, profile, done) {
      if (req.user) {
        var query = {}
        if (req.user.facebook) {
          console.log('facebook')
          query = {
            'facebook.id': req.user.facebook.id
          }
        } else if (req.user.twitter) {
          query = {
            'twitter.id': req.user.twitter.id
          }
        }
        User.findOne(query, function (error, user) {
          if (user) {
            user.google = {}
            user.google.id = profile.id
            user.google.accessToken = accessToken
            user.twitter.refreshToken = refreshToken
            user.save()
            done(null, user)
          }
        })
      } else {
        var query = {
          'google.id': profile.id
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
            user.image = profile._json.image.url
            user.displayName = profile.displayName
            user.google = {}
            user.google.id = profile.id
            user.google.token = accessToken
            user.save()
            done(null, user)
          }
        })
      }
    }
  ))
}
