var express = require('express')
var router = express.Router()
var facebook = require('../services/facebook')(
  '1252092498184971',
  '26df3c64f4216bdedf22314e99dc0b1d'
)
var twitter = require('../services/twitter')(
  'iD436BfDqJXKst25K8d550Fja',
  'y76oPQLcPBfVBHzWJfff3O4rx4ZNeVSR3wOopW9sgPtdmT3bhW'
)

router.use('/', function (req, res, next) {
  if (!req.user) {
    res.redirect('/')
    return
  }
  next()
})

router.use('/', function (req, res, next) {
  if (req.user.twitter) {
    twitter.getUserTimeLine(req.user.twitter.token,
    req.user.twitter.tokenSecret,
    req.user.twitter.id,
    function (results) {
      req.user.twitter.lastPost = results[0].text
      next()
    })
  }
})

/* GET users listing. */
router.get('/', function (req, res, next) {
  if (req.user.facebook) {
    facebook.getImage(req.user.facebook.accessToken,
    function (results) {
      req.user.facebook.image = results.url
      facebook.getFriends(req.user.facebook.accessToken,
        function (results) {
          req.user.facebook.friends = results.total_count
          res.render('users', {user: req.user})
        })
    })
  } else {
    res.render('users', {user: req.user})
  }
})

module.exports = router
