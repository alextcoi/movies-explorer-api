const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator: (v) => {
        const urlRegex = /^http(s)?:\/\/(www\.)?[a-zA-Z0-9-._~:\/?#[\]@!$&'()*\+,;=]{2,256}\.[a-z]{2,6}([a-zA-Z0-9-._~:\/?#[\]@!$&'()*\+,;=]{1,})?/;
        return urlRegex.test(v);
      },
      message: 'Некорректно указана ссылка на постер',
    }
  },
  trailer: {
    type: String,
    required: true,
    validate: {
      validator: (v) => {
        const urlRegex = /^http(s)?:\/\/(www\.)?[a-zA-Z0-9-._~:\/?#[\]@!$&'()*\+,;=]{2,256}\.[a-z]{2,6}([a-zA-Z0-9-._~:\/?#[\]@!$&'()*\+,;=]{1,})?/;
        return urlRegex.test(v);
      },
      message: 'Некорректно указана ссылка на трейлер',
    }
  },
  thumbnail: {
    type: String,
    required: true,
    validate: {
      validator: (v) => {
        const urlRegex = /^http(s)?:\/\/(www\.)?[a-zA-Z0-9-._~:\/?#[\]@!$&'()*\+,;=]{2,256}\.[a-z]{2,6}([a-zA-Z0-9-._~:\/?#[\]@!$&'()*\+,;=]{1,})?/;
        return urlRegex.test(v);
      },
      message: 'Некорректно указана ссылка на картинку',
    }
  },
  owner: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "user",
    required: true,
  },
  movieId: {
    type: String,
    required: true,
  },
  nameRU: {
    type: String,
    required: true,
  },
  nameEN: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("movie", movieSchema);
