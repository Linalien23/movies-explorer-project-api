const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const BadRequest = require('../errors/BadRequest');
const Forbidden = require('../errors/Forbidden');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new BadRequest({ message: 'Некорректный e-mail.' });
      }
    },
  },

  password: {
    type: String,
    required: true,
    select: false,
  },

  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
});

userSchema.statics.findUserByCredentials = function findOne(email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) { // пользователь не найден — отклоняем промис
        return Promise.reject(new Forbidden('Электронная почта или пароль введены неверно'));
      }
      return bcrypt.compare(password, user.password) // сравниваем переданный пароль и хеш из базы

        .then((matched) => {
          if (!matched) { // хеши не совпали — отклоняем промис
            return Promise.reject(new Forbidden('Электронная почта или пароль введены неверно'));
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);