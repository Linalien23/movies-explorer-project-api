const router = require('express').Router();
const users = require('./users');
const movies = require('./movies');
const { createUser, login } = require('../controllers/users');
const { signInValidate, signUpValidate } = require('../middleware/validate');
const auth = require('../middleware/auth');
const NotFound = require('../errors/NotFound');

router.post('/signin', signInValidate, login);
router.post('/signup', signUpValidate, createUser);

router.use(auth);
router.use('/users', users);
router.use('/movies', movies);
router.use('*', (req, res, next) => {
  next(new NotFound('Страница не найдена.'));
});

module.exports = router;