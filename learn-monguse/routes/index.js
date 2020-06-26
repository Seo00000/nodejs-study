var express = require('express');
var User = require('../schemas/users');

var router = express.Router();

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

// router.get('/', function (req, res, next) {
//   User.find({})
//     .then((users) => {
//       res.render('mongoose', { users });
//     })
//     .catch((err) => {
//       console.error(err);
//       next(err);
//     });
// });

router.get('/', async (req, res, next) => {
  try {
    const users = await User.find();
    res.render('mongoose', { users });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
