const moviesRouter = require("express").Router();
const { celebrate, Joi } = require('celebrate');
const {
  getMovies,
  createMovie,
  deleteMovie,
} = require("../controllers/movies");

moviesRouter.get("/", getMovies);

moviesRouter.post("/", celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().pattern(/^http(s)?:\/\/(www\.)?[a-zA-Z0-9-._~:\/?#[\]@!$&'()*\+,;=]{2,256}\.[a-z]{2,6}([a-zA-Z0-9-._~:\/?#[\]@!$&'()*\+,;=]{1,})?/),
    trailer: Joi.string().required().pattern(/^http(s)?:\/\/(www\.)?[a-zA-Z0-9-._~:\/?#[\]@!$&'()*\+,;=]{2,256}\.[a-z]{2,6}([a-zA-Z0-9-._~:\/?#[\]@!$&'()*\+,;=]{1,})?/),
    thumbnail: Joi.string().required().pattern(/^http(s)?:\/\/(www\.)?[a-zA-Z0-9-._~:\/?#[\]@!$&'()*\+,;=]{2,256}\.[a-z]{2,6}([a-zA-Z0-9-._~:\/?#[\]@!$&'()*\+,;=]{1,})?/),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    movieId: Joi.string().required(),
  })
}), createMovie);

moviesRouter.delete("/:movieId", celebrate({
  params: Joi.object().keys({
    movieId: Joi.string()
  })
}), deleteMovie);

module.exports = moviesRouter;
